import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { UsersRepository } from '../repositories/users.repository';
import type { RegisterDto } from '../dto/register.dto';
import type { LoginDto } from '../dto/login.dto';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import type { StripeService } from '../../../infra/stripe/stripe.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private stripeService: StripeService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const stripeCustomer = await this.stripeService.createCustomer(
      registerDto.email,
      registerDto.name,
    );

    const user = await this.usersRepository.create(registerDto, stripeCustomer.id);

    const token = this.generateToken(user);

    return {
      accessToken: token,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      accessToken: token,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersRepository.findById(userId);
  }

  private generateToken(user): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}
