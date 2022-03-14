import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { MysqlDatabaseModule } from './database';
import { TransactionModule } from './transaction/transaction.module';

@Module({
    imports: [
        MysqlDatabaseModule.forRoot(),
        ConfigModule.forRoot(),
        TransactionModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
