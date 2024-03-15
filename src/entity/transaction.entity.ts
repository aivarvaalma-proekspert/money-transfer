import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.entity';

export enum TransactionType {
    ADD = 'add',
    TAKE = 'take',
    SEND = 'send',
    RECEIVE = 'receive'
}

export class DecimalColumnTransformer {
    to(data: number): number {
        return data;
    }
    from(data: string): number {
        return parseFloat(data);
    }
}

@Entity()
export class Transaction {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: bigint;

    @ManyToOne(() => Account, (account) => account.transactions)
    account: Account;

    @Column({
        enum: TransactionType
    })
    transactionType: TransactionType;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
        transformer: new DecimalColumnTransformer()
    })
    amount: number;

    @CreateDateColumn({
        // TODO: This should be created by insert trigger
        default: new Date()
    })
    createdAt: Date;

    @Column({
        // TODO: This should be taken from authenticated user or system
        default: 'user'
    })
    createdBy: string;

    @CreateDateColumn({
        // TODO: This should be created by update trigger
        default: new Date()
    })
    modifiedAt: Date;

    @Column({
        // TODO: This should be taken from authenticated user or system
        default: 'user'
    })
    modifiedBy: string;
}
