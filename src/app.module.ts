import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlashAccount } from 'src/entities';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RequestContextModule } from 'nestjs-request-context';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
      entities: ['dist/**/**.entity{.ts,.js}'],
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      timezone: process.env.TIME_ZONE,
    }),
    TypeOrmModule.forFeature([SlashAccount]),
    UserModule,
    RequestContextModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
