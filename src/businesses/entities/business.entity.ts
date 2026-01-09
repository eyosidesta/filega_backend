import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

export type SubscriptionType = 'BASIC' | 'PREMIUM';
export type BusinessStatus = 'pending' | 'active';

@Entity({ name: 'businesses' })
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  heroImage?: string;

  @Column('text', { array: true, default: '{}' })
  images: string[];

  @Column({ type: 'varchar', length: 20, default: 'BASIC' })
  subscription: SubscriptionType;

  @Column({ type: 'varchar', length: 10, default: 'pending' })
  status: BusinessStatus;

  @Column()
  street: string;

  @Column({ nullable: true })
  unit?: string;

  @Column()
  city: string;

  @Column()
  provinceOrState: string;

  @Column()
  postalCode: string;

  @Column({ length: 2 })
  country: string; // CA or US

  @Column({ type: 'double precision' })
  lat: number;

  @Index()
  @Column({ type: 'double precision' })
  lng: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: any;

  @Column({ type: 'boolean', default: false })
  needsLocationReview: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



