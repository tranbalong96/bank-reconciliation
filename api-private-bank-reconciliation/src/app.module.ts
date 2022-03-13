import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import entities from './typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'user',
            password: 'secret',
            database: 'bank_reconciliation',
            entities,
            synchronize: true,
        }),
        TransactionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
