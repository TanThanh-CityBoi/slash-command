import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [PassportModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
