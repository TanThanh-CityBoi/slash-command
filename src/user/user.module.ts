import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/middlewares';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RequestContextModule } from 'nestjs-request-context';
@Module({
  imports: [PassportModule, RequestContextModule],
  controllers: [UserController],
  providers: [UserService, LocalStrategy],
})
export class UserModule {}
