import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';
import { TransactionService } from './service/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Account } from './entity/account.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env${process.env.NODE_ENV}`],
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATASOURCE_HOST,
            port: parseInt(process.env.DATASOURCE_PORT),
            username: process.env.DATASOURCE_USERNAME,
            password: process.env.DATASOURCE_PASSWORD,
            database: process.env.DATASOURCE_DATABASE,
            schema: process.env.DATASOURCE_SCHEMA,
            entities: [Account, Transaction],
            synchronize: true,
            logging: true
        })
    ],
    controllers: [AccountController],
    providers: [AccountService, TransactionService]
})
export class AppModule {}
