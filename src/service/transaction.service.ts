import { Injectable } from '@nestjs/common';
import { Account } from '../entity/account.entity';
import { TransactionDto } from '../dto/transaction.dto';
import { Transaction, TransactionType } from '../entity/transaction.entity';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ) {}

    async addTransaction(
        transactionalEntityManager: EntityManager,
        account: Account,
        amount: number,
        type: TransactionType
    ): Promise<void> {
        await transactionalEntityManager
            .getRepository(Transaction)
            .createQueryBuilder()
            .insert()
            .into(Transaction)
            .values({
                account: account,
                amount: amount,
                transactionType: type
            })
            .execute();
    }

    async getLockedAccount(
        transactionalEntityManager: EntityManager,
        iban: string
    ): Promise<Account> {
        return transactionalEntityManager
            .getRepository(Account)
            .createQueryBuilder()
            .setLock('pessimistic_write')
            .where('iban = :iban')
            .setParameter('iban', iban)
            .getOneOrFail();
    }

    async changeAccountBalance(
        transactionalEntityManager: EntityManager,
        account: Account,
        transactionDto: TransactionDto
    ): Promise<void> {
        await transactionalEntityManager.save(account);
        await this.addTransaction(
            transactionalEntityManager,
            account,
            transactionDto.amount,
            transactionDto.type
        );
    }

    async reduceAccountBalance(
        transactionalEntityManager: EntityManager,
        account: Account,
        transactionDto: TransactionDto,
        transactionType: TransactionType
    ): Promise<void> {
        if (
            parseFloat(account.balance.toString()) - parseFloat(transactionDto.amount.toString()) <
            0
        ) {
            throw new Error('Not enough money');
        }
        account.balance =
            parseFloat(account.balance.toString()) - parseFloat(transactionDto.amount.toString());
        transactionDto.type = transactionType;
        await this.changeAccountBalance(transactionalEntityManager, account, transactionDto);
    }

    async increaseAccountBalance(
        transactionalEntityManager: EntityManager,
        account: Account,
        transactionDto: TransactionDto,
        transactionType: TransactionType
    ): Promise<void> {
        account.balance =
            parseFloat(account.balance.toString()) + parseFloat(transactionDto.amount.toString());
        transactionDto.type = transactionType;
        await this.changeAccountBalance(transactionalEntityManager, account, transactionDto);
    }

    async addMoney(iban: string, transactionDto: TransactionDto): Promise<void> {
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            await this.getLockedAccount(transactionalEntityManager, iban).then(async (account) => {
                await this.increaseAccountBalance(
                    transactionalEntityManager,
                    account,
                    transactionDto,
                    TransactionType.ADD
                );
                console.info(
                    'Money (',
                    transactionDto.amount,
                    ') is added to account',
                    account.iban
                );
            });
        });
    }

    async takeMoney(iban: string, transactionDto: TransactionDto): Promise<void> {
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            await this.getLockedAccount(transactionalEntityManager, iban).then(async (account) => {
                await this.reduceAccountBalance(
                    transactionalEntityManager,
                    account,
                    transactionDto,
                    TransactionType.TAKE
                );
                console.info(
                    'Money (',
                    transactionDto.amount,
                    ') is taken from account',
                    account.iban
                );
            });
        });
    }

    async transferMoney(
        iban: string,
        ibanTo: string,
        transactionDto: TransactionDto
    ): Promise<void> {
        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            await this.getLockedAccount(transactionalEntityManager, iban).then(async (account) => {
                await this.reduceAccountBalance(
                    transactionalEntityManager,
                    account,
                    transactionDto,
                    TransactionType.SEND
                );
                console.info(
                    'Money (',
                    transactionDto.amount,
                    ') is sent from account',
                    account.iban
                );
            });
            await this.getLockedAccount(transactionalEntityManager, ibanTo).then(
                async (account) => {
                    await this.increaseAccountBalance(
                        transactionalEntityManager,
                        account,
                        transactionDto,
                        TransactionType.RECEIVE
                    );
                    console.info(
                        'Money (',
                        transactionDto.amount,
                        ') is received to account',
                        account.iban
                    );
                }
            );
        });
    }
}
