import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';

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
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByLogin(data.login);

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new ForbiddenException('Password is incorrect');
    }

    const tokens = await this.generateTokens(user.id, user.login);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
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

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || refreshToken !== user.refreshToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.login);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async generateTokens(userId: string, login: string) {
    const payload = { userId, login };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
