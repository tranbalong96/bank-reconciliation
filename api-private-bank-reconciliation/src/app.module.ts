import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from './config';
import { MysqlDatabaseModule } from "./database";

@Module({
    imports: [
        MysqlDatabaseModule.forRoot(),
        ConfigModule.forRoot(),
        TransactionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
