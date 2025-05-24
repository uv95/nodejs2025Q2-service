import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Track } from './models/track.model';

@Injectable()
export class TrackService extends BaseService<Track> {}
