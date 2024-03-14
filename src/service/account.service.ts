import { Injectable } from '@nestjs/common';
import { Account } from '../entity/account.entity';
import { DataSource, Equal } from 'typeorm';
import { AccountDto } from '../dto/account.dto';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ) {}

    async getAccounts(): Promise<Account[]> {
        console.info('Fetch all accounts');
        return await this.dataSource.manager.find(Account);
    }

    async getAccount(iban: string): Promise<Account> {
        console.info('Fetch account by iban', iban);
        return await this.dataSource.manager.getRepository(Account).findOneByOrFail({
            iban: Equal(iban)
        });
    }

    async addAccount(accountDto: AccountDto): Promise<Account> {
        const account = this.dataSource.manager.getRepository(Account).create();
        account.iban = accountDto.iban;
        account.owner = accountDto.owner;
        console.info('Add new account', account);
        return await this.dataSource.manager.save(Account, account);
    }
}
