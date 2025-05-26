import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './model/favorites.model';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesEntity } from './entity/favorites.entity';

@Injectable()
export class FavoritesService {
  protected favorites: Favorites = { artists: [], albums: [], tracks: [] };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  getFavorites(): FavoritesEntity {
    const artists = this.favorites.artists.map((id) =>
      this.artistService.findById(id),
    );
    const albums = this.favorites.albums.map((id) =>
      this.albumService.findById(id),
    );
    const tracks = this.favorites.tracks.map((id) =>
      this.trackService.findById(id),
    );

    return new FavoritesEntity({ artists, albums, tracks });
  }

  private addToFavorites(
    id: string,
    service: ArtistService | AlbumService | TrackService,
    entityName: string,
    favoritesArray: string[],
  ) {
    try {
      service.findById(id);
      favoritesArray.push(id);

      return `${entityName} added to Favorites successfully`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `${entityName} with this id does not exist`,
        );
      }

      throw error;
    }
  }

  addTrack(id: string) {
    return this.addToFavorites(
      id,
      this.trackService,
      'Track',
      this.favorites.tracks,
    );
  }

  addAlbum(id: string) {
    return this.addToFavorites(
      id,
      this.albumService,
      'Album',
      this.favorites.albums,
    );
  }

  addArtist(id: string) {
    return this.addToFavorites(
      id,
      this.artistService,
      'Artist',
      this.favorites.artists,
    );
  }
}
