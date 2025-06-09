import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidUUID } from 'src/utils/validateUUID';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TrackCreateInput) {
    return await this.prisma.track.create({ data });
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track with this id not found');
    }

    return track;
  }

  async update(id: string, data: Prisma.TrackUpdateInput) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track with this id not found');
    }

    return await this.prisma.track.update({ where: { id }, data });
  }

  async delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track with this id not found');
    }

    return await this.prisma.track.delete({ where: { id } });
  }
}
