import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(data: {
    login: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByLogin(data.login);

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, login: user.login };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signup(data: { login: string; password: string }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        version: 1,
      },
    });
  }
}
