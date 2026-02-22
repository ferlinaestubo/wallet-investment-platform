import { IsInt, IsPositive, IsString } from 'class-validator';

export class DepositDto {
  @IsString()
  userId: string;

  @IsInt()
  @IsPositive()
  amount: number;
}
