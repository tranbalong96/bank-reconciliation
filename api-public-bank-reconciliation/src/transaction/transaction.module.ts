import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TRANSACTION_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'transactions_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [],
})
export class TransactionModule { }
