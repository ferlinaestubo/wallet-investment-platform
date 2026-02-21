import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.walletService.create(dto);
  }
@Post('test-wallet')
async createTestWallet() {
  return this.walletService.create({
    userId: 'test-user-001',
    currency: 'PHP',
  });
}

}

