import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Business } from '../businesses/entities/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}







