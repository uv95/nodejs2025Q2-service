import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => FavoritesModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
