import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Artist } from './model/artist.model';
import { FavoritesService } from '../favorites/favorites.service';
import { isValidUUID } from 'src/utils/validateUUID';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { removeReference } from 'src/utils/removeReference';

@Injectable()
export class ArtistService extends BaseService<Artist> {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoriteService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {
    super();
  }

  delete(id: string): void {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    removeReference(this.trackService, id, 'artistId');
    removeReference(this.albumService, id, 'artistId');

    this.favoriteService.removeArtist(id);
    this.items.splice(itemIndex, 1);
  }
}
