import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    return this.favoritesService.addArtist(id);
  }

  @HttpCode(204)
  @Delete('track/:id')
  removeTrack(@Param('id') id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @HttpCode(204)
  @Delete('album/:id')
  removeAlbum(@Param('id') id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  removeArtist(@Param('id') id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
