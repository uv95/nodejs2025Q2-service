import { Exclude, Expose, Transform } from 'class-transformer';

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  version: number;

  @Expose()
  @Transform(({ value }) => new Date(value).getTime())
  createdAt: number;

  @Expose()
  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
