import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UserEntity } from "../typeorm";
import { RegisterDTO } from "./dto/register.dto";
import { RegisterInterface } from "./interfaces/register.interface";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { ConfigService } from "../config";
import { RegisterRO } from "./ro/register.ro";
import { plainToClass } from "class-transformer";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
    ) { }

    /**
     * register user account
     * @param dto 
     * @returns RegisterRO
     */
    async register(dto: RegisterDTO): Promise<RegisterRO> {
        const usernameExisted = await this.userRepository.usernameExisted(dto.username);
        if (usernameExisted) {
            this.logger.error('Error -> username existed');
            throw new HttpException(
                {
                    errorCode: 'ERROR.BAD_REQUEST',
                    errorMessage: 'username existed',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const data = await this.mappingDataAndHash(dto);
        try {
            const user = await this.userRepository.register(data);
            return plainToClass(RegisterRO, user, { excludeExtraneousValues: true });
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot save data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * get user by username
     * @param username 
     * @returns UserEntity
     */
    async getUserByUsername(username: string): Promise<UserEntity> {
        try {
            return await this.userRepository.getUserByUsername(username);
        } catch (err) {
            this.logger.error('Error -> ', err);
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot get user',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * mapping data and hash password
     * @param dto 
     * @returns RegisterInterface
     */
    private async mappingDataAndHash(dto: RegisterDTO): Promise<RegisterInterface> {
        const salt = Number(this.configService.get('SALT_OR_ROUNDS'));
        dto.password = await bcrypt.hash(dto.password, salt)
        const { confirmPassword, ...register } = dto;
        return register;
    }
}
