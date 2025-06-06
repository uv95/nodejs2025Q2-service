import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isValidUUID } from 'src/utils/validateUUID';

enum Entity {
  TRACK = 'Track',
  ALBUM = 'Album',
  ARTIST = 'Artist',
}

enum FavoriteField {
  Track = 'favoriteTracks',
  Album = 'favoriteAlbums',
  Artist = 'favoriteArtists',
}

enum Action {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites() {
    const user = await this.prisma.user.findFirst(); //temporary
    const [albums, artists, tracks] = await Promise.all([
      this.prisma.album.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      }),
      this.prisma.artist.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      }),
      this.prisma.track.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      }),
    ]);

    return {
      albums,
      artists,
      tracks,
    };
  }

  private async validateItem(model: string, id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const item = await this.prisma[model].findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException(`${model} with this id not found`);
    }

    return item;
  }

  private async isFavorite(model: string, userId: string, id: string) {
    const favorites = await this.prisma[model].findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
    });

    return favorites.some((item) => item.id === id);
  }

  private async updateFavorites(
    action: Action,
    id: string,
    entityName: Entity,
  ) {
    try {
      const model = entityName.toLowerCase();
      await this.validateItem(model, id);
      const user = await this.prisma.user.findFirst(); //temporary
      const isInFavorites = await this.isFavorite(model, user.id, id);
      const isAddingToFavorites = action === Action.CONNECT;

      if (isAddingToFavorites && isInFavorites) {
        return `${entityName} already added to favorites`;
      }
      if (!isAddingToFavorites && !isInFavorites) {
        return `${entityName} is not in favoritess`;
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          [FavoriteField[entityName]]: {
            [action]: { id },
          },
        },
      });

      return `${entityName} ${isAddingToFavorites ? 'added to' : 'removedFrom'} Favorites successfully`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `${entityName} with this id does not exist`,
        );
      }
      throw error;
    }
  }

  async addTrack(id: string) {
    return await this.updateFavorites(Action.CONNECT, id, Entity.TRACK);
  }

  async addAlbum(id: string) {
    return await this.updateFavorites(Action.CONNECT, id, Entity.ALBUM);
  }

  async addArtist(id: string) {
    return await this.updateFavorites(Action.CONNECT, id, Entity.ARTIST);
  }

  async removeTrack(id: string) {
    return await this.updateFavorites(Action.DISCONNECT, id, Entity.TRACK);
  }

  async removeAlbum(id: string) {
    return await this.updateFavorites(Action.DISCONNECT, id, Entity.ALBUM);
  }

  async removeArtist(id: string) {
    return await this.updateFavorites(Action.DISCONNECT, id, Entity.ARTIST);
  }
}
