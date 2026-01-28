import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesModule } from '../businesses/businesses.module';
import { Admin } from './entities/admin.entity';
import { Business } from '../businesses/entities/business.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Business]), BusinessesModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}


















