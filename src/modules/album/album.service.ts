import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Album } from './model/album.model';
import { isValidUUID } from 'src/utils/validateUUID';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackService } from '../track/track.service';
import { removeReference } from 'src/utils/removeReference';

@Injectable()
export class AlbumService extends BaseService<Album> {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoriteService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
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

    removeReference(this.trackService, id, 'albumId');
    this.favoriteService.removeAlbum(id);
    this.items.splice(itemIndex, 1);
  }
}
