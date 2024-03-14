import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../service/account.service';
import { HttpException } from '@nestjs/common';

describe('AccountController', () => {
    let accountController: AccountController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AccountController],
            providers: [AccountService]
        }).compile();

        accountController = app.get<AccountController>(AccountController);
    });

    describe('root', () => {
        it('should return HttpException', async () => {
            await expect(accountController.getAccount('ABC123')).rejects.toThrowError(
                HttpException
            );
        });
    });
});
