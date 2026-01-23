import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import axios from 'axios';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly repo: Repository<Business>,
  ) {}

  private async geocodeAddress(dto: CreateBusinessDto) {
    const key = process.env.GOOGLE_GEOCODING_API_KEY;
    if (!key) return null;
    const parts = [
      dto.street,
      dto.unit,
      dto.city,
      dto.provinceOrState,
      dto.postalCode,
      dto.country,
    ]
      .filter(Boolean)
      .join(', ');
    try {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: parts,
          components: 'country:CA|country:US',
          key,
        },
      });
      if (data.status !== 'OK' || !data.results?.length) return null;
      const r = data.results[0];
      const countryComp = r.address_components?.find((c) => c.types?.includes('country'));
      const country = countryComp?.short_name;
      if (country !== 'CA' && country !== 'US') return null;
      const { lat, lng } = r.geometry.location;
      return { lat, lng };
    } catch {
      return null;
    }
  }

  async create(dto: CreateBusinessDto) {
    const geo = await this.geocodeAddress(dto);
    const lat = geo?.lat ?? 0;
    const lng = geo?.lng ?? 0;
    const needsLocationReview = !geo;

    const business = this.repo.create({
      ...dto,
      lat,
      lng,
      status: 'pending',
      payment_status: 'pending_payment',
      needsLocationReview,
      images: dto.images || [],
    });
    const saved = await this.repo.save(business);

    if (geo) {
      await this.repo
        .createQueryBuilder()
        .update(Business)
        .set({
          location: () => `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
        })
        .where('id = :id', { id: saved.id })
        .execute();
      return this.findOne(saved.id);
    }

    return saved;
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Business not found');
    return found;
  }

  async findAll() {
    return this.repo.find({
      where: { status: 'active' },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findAllLightweight() {
    return this.repo.find({
      where: { status: 'active' },
      order: { category: 'ASC', name: 'ASC' },
      select: [
        'id',
        'name',
        'category',
        'city',
        'provinceOrState',
        'country',
        'subscription',
        'images',
        'phone',
        'website',
        'heroImage',
        'email',
        'lat',
        'lng',
        'status',
      ],
    });
  }

  async update(id: string, dto: Partial<Business>) {
    const existing = await this.findOne(id);
    const merged = this.repo.merge(existing, dto);
    return this.repo.save(merged);
  }
}






