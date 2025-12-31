import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, ILike } from 'typeorm';
import { Business } from '../businesses/entities/business.entity';

export interface BoundsQuery {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
  category?: string;
  city?: string;
  term?: string;
  limit?: number;
}

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Business)
    private readonly repo: Repository<Business>,
  ) {}

  async inBounds(q: BoundsQuery) {
    const limit = Math.min(q.limit || 300, 500);
    const where: any = {
      status: 'active',
      lat: MoreThanOrEqual(q.swLat),
      lng: MoreThanOrEqual(q.swLng),
    };

    // Handle crossing anti-meridian is out of scope for CA/US; assume bounds inside Americas
    where.lat = MoreThanOrEqual(q.swLat);
    where.lng = MoreThanOrEqual(q.swLng);

    if (q.category && q.category !== 'All') where.category = q.category;
    if (q.city && q.city !== 'All') where.city = q.city;
    // For simplicity with TypeORM, term filter reused via name ILIKE
    if (q.term) {
      where.name = q.term ? ILike(`%${q.term}%`) : undefined;
    }

    // Constrain NE bounds
    const extraWhere = {
      lat: LessThanOrEqual(q.neLat),
      lng: LessThanOrEqual(q.neLng),
    };

    const items = await this.repo.find({
      select: ['id', 'name', 'lat', 'lng', 'category', 'subscription'],
      where: { ...where, ...extraWhere },
      order: { subscription: 'DESC', name: 'ASC' },
      take: limit,
    });

    return { items, count: items.length };
  }
}


