import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '../config';

@Module({})
export class RabbitModule {
    static register(): DynamicModule {
        return {
            module: RabbitModule,
            imports: [
                ClientsModule.registerAsync(
                    [{
                        name: 'TRANSACTION_SERVICE',
                        imports: [ConfigModule],
                        inject: [ConfigService],
                        useFactory: async (configService: ConfigService): Promise<RmqOptions> => {
                            return {
                                transport: Transport.RMQ,
                                options: {
                                    urls: [`${configService.getRabbitMQUrl()}:${configService.getRabbitMQPort()}`],
                                    queue: 'transactions_queue',
                                    queueOptions: {
                                        durable: false
                                    }
                                }
                            }
                        }
                    }])
            ],
            exports: [ClientsModule]
        };
    }
}
