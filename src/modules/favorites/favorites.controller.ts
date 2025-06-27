import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FavoritesService } from './favorites.service';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    login: string;
  };
}

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.getFavorites(userId);
  }

  @Post('track/:id')
  async addTrack(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.addTrack(id, userId);
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.addAlbum(id, userId);
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.addArtist(id, userId);
  }

  @HttpCode(204)
  @Delete('track/:id')
  async removeTrack(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.removeTrack(id, userId);
  }

  @HttpCode(204)
  @Delete('album/:id')
  async removeAlbum(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.removeAlbum(id, userId);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  async removeArtist(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { userId } = req.user;

    return await this.favoritesService.removeArtist(id, userId);
  }
}
