import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/customDecorators/isPublic';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../user/entity/user.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Public()
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.signup(dto);

    return plainToInstance(UserEntity, newUser, {
      excludeExtraneousValues: true,
    });
  }
}
