import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidUUID } from 'src/utils/validateUUID';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AlbumCreateInput) {
    return await this.prisma.album.create({ data });
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album with this id not found');
    }

    return album;
  }

  async update(id: string, data: Prisma.AlbumUpdateInput) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album with this id not found');
    }

    return await this.prisma.album.update({ where: { id }, data });
  }

  async delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album with this id not found');
    }

    return await this.prisma.album.delete({ where: { id } });
  }
}
