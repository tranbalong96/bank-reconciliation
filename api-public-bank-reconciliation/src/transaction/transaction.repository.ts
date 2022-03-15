import { TransactionEntity } from "src/typeorm";
import { DeleteResult, EntityRepository, Repository, UpdateResult } from "typeorm";
import { SaveTransactionInterface } from "./interfaces/save-transaction.interface";

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
    /**
     * 
     * @returns TransactionEntity[]
     */
    async getAllTransaction(): Promise<TransactionEntity[]> {
        return await this.find();
    }

    /**
     * 
     * @param id 
     * @returns TransactionEntity
     */
    async getById(id: number): Promise<TransactionEntity> {
        return await this.findOne({ id });
    }

    /**
     * 
     * @param data 
     * @returns TransactionEntity
     */
    async saveTransaction(data: SaveTransactionInterface): Promise<TransactionEntity> {
        return await this.save(data);
    }

    /**
     * 
     * @param id 
     * @param data 
     * @returns UpdateResult
     */
    async updateTransaction(id: number, data: SaveTransactionInterface): Promise<UpdateResult> {
        return await this.update(id, { ...data });
    }

    /**
     * 
     * @param id 
     * @returns DeleteResult
     */
    async deleteTransaction(id: number): Promise<DeleteResult> {
        return await this.delete(id);
    }

    /**
     * 
     * @param id 
     * @returns boolean
     */
    async isIdExisted(id: number): Promise<boolean> {
        return !!await this.getById(id);
    }
}
