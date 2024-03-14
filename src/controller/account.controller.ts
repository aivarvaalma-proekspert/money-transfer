import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { Account } from '../entity/account.entity';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionDto } from '../dto/transaction.dto';
import { TransactionService } from '../service/transaction.service';
import { AccountDto } from '../dto/account.dto';

@ApiTags('mt')
@Controller('accounts')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly transactionService: TransactionService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Fetch all accounts' })
    async getAccounts(): Promise<Account[]> {
        console.info('Fetch all account');
        return this.accountService.getAccounts();
    }

    @Get(':iban')
    @ApiOperation({ summary: 'Fetch account by iban' })
    @ApiParam({
        name: 'iban',
        type: 'string'
    })
    async getAccount(@Param('iban') iban: string): Promise<Account> {
        console.info('Fetch account by iban', iban);
        return await this.accountService.getAccount(iban).catch((err) => {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        });
    }

    @Post()
    @ApiOperation({ summary: 'Add new account' })
    async postAccount(@Body() accountDto: AccountDto): Promise<Account> {
        return this.accountService.addAccount(accountDto);
    }

    @Post(':iban/transactions/add-money')
    @ApiOperation({ summary: 'Top-up account balance' })
    @ApiParam({
        name: 'iban',
        type: 'string'
    })
    async postAddMoney(
        @Param('iban') iban: string,
        @Body() transaction: TransactionDto
    ): Promise<void> {
        console.info('Add ', transaction.amount, 'to account' + iban);
        await this.transactionService.addMoney(iban, transaction).catch((err) => {
            console.error('Error when adding money to account', err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        });
    }

    @Post(':iban/transactions/take-money')
    @ApiOperation({ summary: 'Withdraw money' })
    @ApiParam({
        name: 'iban',
        type: 'string'
    })
    async postTakeMoney(
        @Param('iban') iban: string,
        @Body() transaction: TransactionDto
    ): Promise<void> {
        console.info('Take', transaction.amount, 'from account', iban);
        await this.transactionService.takeMoney(iban, transaction).catch((err) => {
            console.error('Error when taking money from account', err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        });
    }

    @Post(':iban/transactions/transfer-money/:ibanTo')
    @ApiOperation({ summary: 'Transfer money from one account to another' })
    @ApiParam({
        name: 'iban',
        type: 'string'
    })
    @ApiParam({
        name: 'ibanTo',
        type: 'string'
    })
    async postTransferMoney(
        @Param('iban') iban: string,
        @Param('ibanTo') ibanTo: string,
        @Body() transaction: TransactionDto
    ): Promise<void> {
        console.info(
            'Transfer money from account',
            iban,
            'to account',
            ibanTo,
            'with amount',
            transaction.amount
        );
        await this.transactionService.transferMoney(iban, ibanTo, transaction).catch((err) => {
            console.error('Error when transferring money from one account to another', err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        });
    }
}
