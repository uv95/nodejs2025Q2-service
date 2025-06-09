import { Module } from '@nestjs/common';
import { IsLoginUniqueConstraint } from 'src/common/customDecorators/IsLoginUnique';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, IsLoginUniqueConstraint],
})
export class UserModule {}
