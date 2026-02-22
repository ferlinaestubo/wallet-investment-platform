import { IsInt, IsPositive, IsString } from 'class-validator';

export class WithdrawDto {
  @IsString()
  userId: string;

  @IsInt()
  @IsPositive()
  amount: number;
}
