import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  imports: [PassportModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
