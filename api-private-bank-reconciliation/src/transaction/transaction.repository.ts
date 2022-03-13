import { TransactionEntity } from "src/typeorm";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
    getAllTransaction() {
        return this.find();
    }
}
