import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites() {
    return await this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  async addTrack(@Param('id') id: string) {
    return await this.favoritesService.addTrack(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string) {
    return await this.favoritesService.addAlbum(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string) {
    return await this.favoritesService.addArtist(id);
  }

  @HttpCode(204)
  @Delete('track/:id')
  async removeTrack(@Param('id') id: string) {
    return await this.favoritesService.removeTrack(id);
  }

  @HttpCode(204)
  @Delete('album/:id')
  async removeAlbum(@Param('id') id: string) {
    return await this.favoritesService.removeAlbum(id);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  async removeArtist(@Param('id') id: string) {
    return await this.favoritesService.removeArtist(id);
  }
}
