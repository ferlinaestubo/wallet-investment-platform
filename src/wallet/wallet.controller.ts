import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  getWallet(@Param('userId') userId: string) {
    return this.walletService.getByUserId(userId);
  }

  @Post('deposit')
  deposit(@Body() dto: DepositDto) {
    return this.walletService.deposit(dto.userId, dto.amount);
  }

  @Post('withdraw')
  withdraw(@Body() dto: WithdrawDto) {
    return this.walletService.withdraw(dto.userId, dto.amount);
  }

}
