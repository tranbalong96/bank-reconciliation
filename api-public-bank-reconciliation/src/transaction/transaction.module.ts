import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RabbitModule } from "../rabbitmq";
import { TransactionController } from "./transaction.controller";
import { TransactionRepository } from "./transaction.repository";
import { TransactionService } from "./transaction.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionRepository]),
        RabbitModule.register(),
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [],
})
export class TransactionModule { }
