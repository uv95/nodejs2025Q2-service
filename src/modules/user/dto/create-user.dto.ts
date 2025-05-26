import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsNumber()
  version: number;

  @IsNumber()
  createdAt: number;

  @IsNumber()
  updatedAt: number;
}
