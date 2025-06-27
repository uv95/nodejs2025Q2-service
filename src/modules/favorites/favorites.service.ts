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

  async getFavorites(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

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
    userId: string,
  ) {
    try {
      const model = entityName.toLowerCase();
      await this.validateItem(model, id);
      const isAddingToFavorites = action === Action.CONNECT;
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const isInFavorites = await this.isFavorite(model, user.id, id);

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

  async addTrack(id: string, userId: string) {
    return await this.updateFavorites(Action.CONNECT, id, Entity.TRACK, userId);
  }

  async addAlbum(id: string, userId: string) {
    return await this.updateFavorites(Action.CONNECT, id, Entity.ALBUM, userId);
  }

  async addArtist(id: string, userId: string) {
    return await this.updateFavorites(
      Action.CONNECT,
      id,
      Entity.ARTIST,
      userId,
    );
  }

  async removeTrack(id: string, userId: string) {
    return await this.updateFavorites(
      Action.DISCONNECT,
      id,
      Entity.TRACK,
      userId,
    );
  }

  async removeAlbum(id: string, userId: string) {
    return await this.updateFavorites(
      Action.DISCONNECT,
      id,
      Entity.ALBUM,
      userId,
    );
  }

  async removeArtist(id: string, userId: string) {
    return await this.updateFavorites(
      Action.DISCONNECT,
      id,
      Entity.ARTIST,
      userId,
    );
  }
}
