import { IsNotEmpty, IsString } from 'class-validator';
import { IsLoginUnique } from 'src/common/customDecorators/IsLoginUnique';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsLoginUnique({ message: 'Login must be unique' })
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
