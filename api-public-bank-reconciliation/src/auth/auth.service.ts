import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { plainToClass } from "class-transformer";
import { ValidateUserRO } from "./ro/validate-user.ro";
import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from "./dto/login.dto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async login(dto: LoginDTO) {
        const validateUser = await this.validateUser(dto.username, dto.password);
        if (!validateUser) {
            this.logger.error('Error -> user invalid')
            throw new UnauthorizedException();
        }
        const payload = {
            name: validateUser.name,
            username: validateUser.username,
            sub: validateUser.id
        };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
    
    async authorize(authorization: string) {
        const token = authorization.replace('Bearer ', '');
        try {
            const data = await this.jwtService.verifyAsync(token);
            return !!data;
        } catch(err) {
            this.logger.error(err)
            return false;
        }
    }

    private async validateUser(username: string, password: string): Promise<ValidateUserRO> {
        const user = await this.userService.getUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return plainToClass(ValidateUserRO, user, { excludeExtraneousValues: true });
        }
        return null;
    }
}
