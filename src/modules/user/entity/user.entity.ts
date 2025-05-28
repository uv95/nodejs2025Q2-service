import { Exclude, Expose } from 'class-transformer';

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  version: number;

  @Expose()
  createdAt: number;

  @Expose()
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
