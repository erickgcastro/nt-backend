import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../common/enums/role.enum';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(registerDto: RegisterDto, stripeCustomerId?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        phone: registerDto.phone,
        roles: [Role.USER],
        stripeCustomerId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }
}
