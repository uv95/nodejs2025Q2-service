import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { Track } from './model/track.model';

@Injectable()
export class TrackService extends BaseService<Track> {}
