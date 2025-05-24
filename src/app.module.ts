import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './modules/artist/artist.module';
import { TrackModule } from './modules/track/track.module';
import { AlbumModule } from './modules/album/album.module';

@Module({
  imports: [ArtistModule, TrackModule, AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
