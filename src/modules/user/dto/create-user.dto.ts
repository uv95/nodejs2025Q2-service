import { IsString } from 'class-validator';
import { IsLoginUnique } from 'src/common/customDecorators/IsLoginUnique';

export class CreateUserDto {
  @IsString()
  @IsLoginUnique({ message: 'Login must be unique' })
  login: string;

  @IsString()
  password: string;
}
