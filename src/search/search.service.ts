import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Business } from '../businesses/entities/business.entity';

export interface SearchQuery {
  term?: string;
  category?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Business)
    private readonly repo: Repository<Business>,
  ) {}

  async search(params: SearchQuery) {
    const { term, category, city, page = 1, pageSize = 10 } = params;
    const where: any = { status: 'active' };

    if (category && category !== 'All') where.category = category;
    if (city && city !== 'All') where.city = city;
    if (term) {
      where.name = ILike(`%${term}%`);
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      order: {
        subscription: 'DESC', // PREMIUM first
        name: 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
    };
  }
}



















