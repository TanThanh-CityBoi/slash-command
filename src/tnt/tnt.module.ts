import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TntController } from './tnt.controller';
import { TntService } from './tnt.service';

@Module({
  imports: [PassportModule],
  controllers: [TntController],
  providers: [TntService],
})
export class TntModule {}
