import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async getByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  // 👇 ADD DEPOSIT HERE
  async deposit(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) throw new BadRequestException('Wallet not found');

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: amount },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount,
          reference: `dep_${Date.now()}`,
        },
      });

      return updatedWallet;
    });
  }

  // 👇 ADD WITHDRAW HERE
  async withdraw(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) throw new BadRequestException('Wallet not found');
    if (wallet.balance < amount)
      throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAW',
          amount,
          reference: `wd_${Date.now()}`,
        },
      });

      return updatedWallet;
    });
  }
async getTransactionsByUserId(userId: string) {
    // optional: ensure user exists (or wallet exists)
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }

    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' }, // newest first
    });
  }
}
