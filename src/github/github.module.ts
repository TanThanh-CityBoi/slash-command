import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/middlewares';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [PassportModule],
  controllers: [GithubController],
  providers: [GithubService, LocalStrategy],
})
export class UserModule {}
