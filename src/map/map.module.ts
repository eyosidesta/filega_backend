import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../businesses/entities/business.entity';
import { MapService } from './map.service';
import { MapController } from './map.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}



















