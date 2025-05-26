import { Controller, Get, Param, Post } from '@nestjs/common';
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

  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
  //   return this.favoritesService.update(id, dto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.favoritesService.delete(id);
  // }
}
