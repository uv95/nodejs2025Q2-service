import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { User } from './models/user.model';

@Injectable()
export class UserService extends BaseService<User> {}
