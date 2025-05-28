import {
  Inject,
  BadRequestException,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Track } from './model/track.model';
import { FavoritesService } from '../favorites/favorites.service';
import { isValidUUID } from 'src/utils/validateUUID';

@Injectable()
export class TrackService extends BaseService<Track> {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoriteService: FavoritesService,
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

    this.favoriteService.removeTrack(id);
    this.items.splice(itemIndex, 1);
  }
}
