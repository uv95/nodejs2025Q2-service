import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return plainToInstance(UserEntity, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserPasswordDto) {
    const updatedUser = await this.userService.updatePassword(id, dto);

    return plainToInstance(UserEntity, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
