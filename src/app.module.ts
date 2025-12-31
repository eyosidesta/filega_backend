import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { BusinessesModule } from './businesses/businesses.module';
import { SearchModule } from './search/search.module';
import { MapModule } from './map/map.module';
import { Business } from './businesses/entities/business.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // TODO: replace with migrations in prod
    }),
    TypeOrmModule.forFeature([Business]),
    HealthModule,
    BusinessesModule,
    SearchModule,
    MapModule,
  ],
})
export class AppModule {}
