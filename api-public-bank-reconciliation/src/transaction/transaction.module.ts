import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitModule } from "../rabbitmq";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
    imports: [
        RabbitModule.register()
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [],
})
export class TransactionModule { }
