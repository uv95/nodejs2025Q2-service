import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidUUID } from 'src/utils/validateUUID';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: { login: string; password: string }) {
    return await this.prisma.user.create({
      data: {
        ...data,
        version: 1,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User with this id not found');
    }

    return user;
  }

  async updatePassword(
    id: string,
    data: { oldPassword: string; newPassword: string },
  ) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User with this id not found');
    }

    if (user.password !== data.oldPassword) {
      throw new ForbiddenException('Password is incorrect');
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        password: data.newPassword,
        version: ++user.version,
      },
    });
  }

  async delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User with this id not found');
    }

    return await this.prisma.user.delete({ where: { id } });
  }
}
