import { Column, Entity } from "typeorm";
import { BaseExtendEntity } from "./base.entity";

@Entity('transactions')
export class TransactionEntity extends BaseExtendEntity {
    @Column({ name: 'content', type: 'varchar', length: 255, nullable: false })
    content: string;

    @Column({ name: 'amount', type: 'int', nullable: false })
    amount: number;

    @Column({ name: 'type', type: 'varchar', length: 50, nullable: false })
    type: string;

    @Column({ name: 'date', type: 'datetime', nullable: false })
    date: Date;
}
