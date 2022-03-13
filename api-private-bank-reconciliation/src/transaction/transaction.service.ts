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

    async create(dto: TransactionDTO[]): Promise<TransactionEntity[]> {
        try {
            return await this.transactionsRepository.save(dto);
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
