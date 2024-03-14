import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AccountDto {
    @ApiProperty()
    @IsNotEmpty()
    iban: string;

    @ApiProperty()
    @IsNotEmpty()
    owner: string;
}
