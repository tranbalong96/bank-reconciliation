import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseExtendEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;
}