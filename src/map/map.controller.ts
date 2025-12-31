import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map/businesses')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  inBounds(
    @Query('neLat') neLat: string,
    @Query('neLng') neLng: string,
    @Query('swLat') swLat: string,
    @Query('swLng') swLng: string,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('term') term?: string,
  ) {
    return this.mapService.inBounds({
      neLat: Number(neLat),
      neLng: Number(neLng),
      swLat: Number(swLat),
      swLng: Number(swLng),
      category,
      city,
      term,
    });
  }
}


