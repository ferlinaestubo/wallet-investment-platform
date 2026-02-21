import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('test-wallet')
  async createTestWallet(@Body() body: { name?: string }) {
    const wallet = await this.walletService.createTestWallet(body?.name);
    return { ok: true, wallet };
  }
}
