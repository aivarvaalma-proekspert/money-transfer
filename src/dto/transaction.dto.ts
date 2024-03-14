import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entity/transaction.entity';
import { IsPositive } from 'class-validator';

export class TransactionDto {
    @ApiProperty()
    @IsPositive()
    amount: number;

    type: TransactionType;
}
