import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/db';
import { Artist } from './models/artist.model';

@Injectable()
export class ArtistService extends BaseService<Artist> {}
