import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TransactionEntity } from "src/typeorm";
import { TransactionRepository } from "./transaction.repository";
import { TransactionDTO } from "./dto/transaction.dto";

@Injectable()
export class TransactionService {
    constructor(
        private readonly transactionsRepository: TransactionRepository,
    ) {
    }

    // async create(dto: TransactionDTO[]): Promise<TransactionEntity[]> {
    async create(dto: TransactionDTO[]) {
        try {
            console.log(dto)
            return;
            // return await this.transactionsRepository.save(dto);
        } catch (err) {
            throw new HttpException(
                {
                    errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
                    errorMessage: 'Cannot save data',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
