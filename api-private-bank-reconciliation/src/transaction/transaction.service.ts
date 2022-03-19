import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { TransactionEntity } from "src/typeorm";
import { TransactionRepository } from "./transaction.repository";
import { TransactionDTO } from "./dto/transaction.dto";

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        private readonly transactionsRepository: TransactionRepository,
    ) {
    }

    async create(dto: TransactionDTO[]) {
        try {
            this.logger.log(`${dto.length} saved!`);
            await this.transactionsRepository.save(dto);
            return {
                successImport: dto.length,
            }
        } catch (err) {
            this.logger.error('Error -> ', err);
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
