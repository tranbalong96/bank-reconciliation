import { Column, Entity } from "typeorm";
import { BaseExtendEntity } from "./base.entity";

@Entity('users')
export class UserEntity extends BaseExtendEntity {
    @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ name: 'username', type: 'varchar', length: 255, nullable: false, unique: true })
    username: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
    password: string;
}
