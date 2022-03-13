import { Controller, Get, UsePipes, ValidationPipe } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { TransactionDTO } from "./dto/transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    @UsePipes(new ValidationPipe())
    @EventPattern('create')
    async create(dto: TransactionDTO[]) {
        return await this.transactionService.create(dto);
    }
}
