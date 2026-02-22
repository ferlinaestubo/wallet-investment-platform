import { Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('test-user')
  async createTestUser() {
    const email = `test_${Date.now()}@example.com`;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: 'test12345',
      },
    });

    return { ok: true, user };
  }
}
