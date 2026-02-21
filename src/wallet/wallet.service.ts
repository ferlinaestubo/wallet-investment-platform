import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWalletDto) {
    try {
      return await this.prisma.wallet.create({
        data: {
          userId: dto.userId,
          currency: dto.currency,
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new BadRequestException('Wallet already exists for this user.');
      }
      throw err;
    }
  }

  async getWallet(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  // ✅ for POST /wallet/test-wallet
  async createTestWallet() {
    return this.prisma.wallet.create({
      data: {
        userId: `test_${Date.now()}`,
        currency: 'PHP',
      },
    });
  }
}
