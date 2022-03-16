import { UserEntity } from "../typeorm";
import { EntityRepository, Repository } from "typeorm";
import { RegisterInterface } from "./interfaces/register.interface";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    /**
     * 
     * @param data 
     * @returns UserEntity
     */
    async register(data: RegisterInterface): Promise<UserEntity> {
        return await this.save(data);
    }

    async getUserByUsername(username: string): Promise<UserEntity> {
        return await this.findOne({ where: { username } })
    }

    /**
     * 
     * @param username 
     */
    async usernameExisted(username: string): Promise<boolean> {
        return !!await this.getUserByUsername(username);
    }
}
