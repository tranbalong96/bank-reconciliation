import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { TransactionDTO } from "./dto/transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    @EventPattern('create')
    async create(dto: TransactionDTO[]) {
        return await this.transactionService.create(dto);
    }
}
