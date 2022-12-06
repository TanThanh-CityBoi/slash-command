import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ExpressParser } from '@ogma/platform-express';
import {
  LocalAuthGuard,
  TntInterceptor,
  TransformInterceptor,
} from './middlewares';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { OgmaModule } from '@ogma/nestjs-module';
import { RequestContextModule } from 'nestjs-request-context';
import { GithubService } from './github/github.service';
import { TntService } from './tnt/tnt.service';
import { GithubController } from './github/github.controller';
import { TntController } from './tnt/tnt.controller';
import { TntModule } from './tnt/tnt.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    OgmaModule.forRoot({
      service: {
        color: false,
        json: false,
        application: process.env['npm_package_name'],
      },
      interceptor: {
        rpc: false,
        http: ExpressParser,
        ws: false,
        gql: false,
      },
    }),
    RequestContextModule,
    UserModule,
    TntModule,
    GithubModule,
  ],
  controllers: [AppController, UserController, GithubController, TntController],
  providers: [
    AppService,
    UserService,
    GithubService,
    TntService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TntInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: LocalAuthGuard,
    },
  ],
})
export class AppModule {}
