import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('test-wallet')
async testWallet() {
  const wallet = await this.walletService.createTestWallet();
  return { ok: true, wallet };
}

}
