import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { BaseService } from 'src/common/baseService';
import { User } from './model/user.model';
import { isValidUUID } from 'src/utils/validateUUID';

@Injectable()
export class UserService extends BaseService<User> {
  create(data: { login: string; password: string }) {
    const id = randomUUID();
    const newUser = {
      ...data,
      id,
      version: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.items.push(newUser);

    return newUser;
  }

  updatePassword(
    id: string,
    data: { oldPassword: string; newPassword: string },
  ) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = this.findById(id);

    if (user.password !== data.oldPassword) {
      throw new ForbiddenException('Password is incorrect');
    }

    const updatedUser: User = {
      ...user,
      password: data.newPassword,
      version: ++user.version,
      updatedAt: Date.now(),
    };

    Object.assign(user, updatedUser);

    return updatedUser;
  }
}
