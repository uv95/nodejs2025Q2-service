// import { Expose } from 'class-transformer';
import { Album } from 'src/modules/album/model/album.model';
import { Artist } from 'src/modules/artist/model/artist.model';
import { Track } from 'src/modules/track/model/track.model';

export class FavoritesEntity {
  //   @Expose()
  artists: Artist[];

  //   @Expose()
  albums: Album[];

  //   @Expose()
  tracks: Track[];

  constructor(favorites: FavoritesEntity) {
    Object.assign(this, favorites);
  }
}
