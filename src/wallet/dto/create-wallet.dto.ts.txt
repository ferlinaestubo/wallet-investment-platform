import { IsIn, IsString, Length } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @Length(1, 64)
  userId: string;

  @IsIn(['PHP', 'USD'])
  currency: 'PHP' | 'USD' = 'PHP';
}
