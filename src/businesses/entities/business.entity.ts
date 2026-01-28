import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

export type SubscriptionType = 'BASIC' | 'PREMIUM';
export type BusinessStatus = 'pending' | 'active' | 'rejected' | 'suspended';
export type PaymentStatus = 'pending_payment' | 'active' | 'rejected' | 'overdue';
export type PaymentMethod = 'stripe' | 'etransfer' | 'cash' | 'other';

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

  @Column({ default: 'pending_payment' })
  payment_status: PaymentStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  payment_method?: PaymentMethod;

  @Column({nullable: true})
  stripeCheckoutSessionId?: string;

  @Column({nullable: true})
  stripePaymentIntentId?: string;

  @Column({nullable: true})
  paidAmountCents?: number;

  @Column({ type: 'timestamptz', nullable: true})
  paidAt?: Date;

  @Column({ nullable: true })
  currency?: string;

  @Column({ type: 'text', nullable: true })
  paymentReference?: string;

  @Column({ type: 'text', nullable: true })
  paymentNotes?: string;

  @Column({ type: 'timestamptz', nullable: true })
  renewalDueAt?: Date;

}



