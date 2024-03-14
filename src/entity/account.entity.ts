import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';

@Entity()
export class Account {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: bigint;

    @ApiProperty()
    @Column({ unique: true })
    iban: string;

    @ApiProperty()
    @Column()
    owner: string;

    @ApiProperty()
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[];

    @ApiProperty()
    @CreateDateColumn({
        // TODO: This should be created by insert trigger
        default: new Date()
    })
    createdAt: Date;

    @ApiProperty()
    @Column({
        // TODO: This should be taken from authenticated user or system
        default: 'user'
    })
    createdBy: string;

    @ApiProperty()
    @CreateDateColumn({
        // TODO: This should be created by update trigger
        default: new Date()
    })
    modifiedAt: Date;

    @ApiProperty()
    @Column({
        // TODO: This should be taken from authenticated user or system
        default: 'user'
    })
    modifiedBy: string;
}
