import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Album } from './models/album.model';

@Injectable()
export class AlbumService extends BaseService<Album> {}
