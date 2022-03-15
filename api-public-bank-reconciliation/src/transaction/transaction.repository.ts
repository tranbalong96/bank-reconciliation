import { plainToClass } from "class-transformer";
import { TransactionEntity } from "src/typeorm";
import { DeleteResult, EntityRepository, Repository, UpdateResult } from "typeorm";
import { SaveTransactionInterface } from "./interfaces/save-transaction.interface";
import { TransactionRO } from "./ro/transaction.ro";

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
    async getAllTransaction(): Promise<TransactionEntity[]> {
        return await this.find();
    }

    async getById(id: number): Promise<TransactionEntity> {
        return await this.findOne({ id });
    }

    async saveTransaction(data: SaveTransactionInterface): Promise<TransactionEntity> {
        return await this.save(data);
    }

    async updateTransaction(id: number, data: SaveTransactionInterface): Promise<UpdateResult> {
        return await this.update(id, { ...data });
    }

    async deleteTransaction(id: number): Promise<DeleteResult> {
        return await this.delete(id);
    }

    async isIdExisted(id: number) {
        return !!await this.getById(id);
    }
}
