import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    const newUser = this.userService.create(dto);

    return plainToInstance(UserEntity, newUser, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  getAll() {
    const users = this.userService.getAll();

    return plainToInstance(UserEntity, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.userService.findById(id);

    return plainToInstance(UserEntity, user, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserPasswordDto) {
    const updatedUser = this.userService.updatePassword(id, dto);

    return plainToInstance(UserEntity, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
