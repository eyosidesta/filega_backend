import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { BusinessesModule } from './businesses/businesses.module';
import { SearchModule } from './search/search.module';
import { MapModule } from './map/map.module';
import { Business } from './businesses/entities/business.entity';
import { MediaModule } from './media/media.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';

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
      synchronize: process.env.NODE_ENV !== 'production', // disable schema sync in production
    }),
    TypeOrmModule.forFeature([Business]),
    HealthModule,
    BusinessesModule,
    SearchModule,
    MapModule,
    MediaModule,
    PaymentsModule,
    WebhooksModule
  ],
})
export class AppModule {}
