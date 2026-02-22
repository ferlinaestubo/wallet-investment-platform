import { Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('test-user')
  async createTestUser() {
    const email = `test_${Date.now()}@example.com`;

    // ⚠️ If your User model requires more fields (name/password/etc),
    // we will adjust after you show schema. For now try email only.
    const user = await this.prisma.user.create({
      data: { email },
    });

    return { ok: true, user };
  }
}
