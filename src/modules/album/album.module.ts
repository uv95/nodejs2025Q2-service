import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => FavoritesModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
