import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Artist } from './model/artist.model';

@Injectable()
export class ArtistService extends BaseService<Artist> {}
