import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

const Countries = ['CA', 'US'] as const;
type Country = (typeof Countries)[number];

const Subscriptions = ['BASIC', 'PREMIUM'] as const;
type Subscription = (typeof Subscriptions)[number];

const Statuses = ['pending', 'active', 'rejected', 'suspended'] as const;
type Status = (typeof Statuses)[number];

const PaymentStatuses = ['pending_payment', 'active', 'rejected', 'overdue'] as const;
type PaymentStatus = (typeof PaymentStatuses)[number];

const PaymentMethods = ['stripe', 'etransfer', 'cash', 'other'] as const;
type PaymentMethod = (typeof PaymentMethods)[number];

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  images?: string[];

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl()
  heroImage?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(Subscriptions)
  subscription: Subscription;

  @IsEnum(Statuses)
  @IsOptional()
  status?: Status;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  provinceOrState: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsEnum(Countries)
  country: Country;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  stripeCheckoutSessionId?: string;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;

  @IsOptional()
  @IsNumber()
  paidAmountCents?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(PaymentStatuses)
  payment_status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethods)
  payment_method?: PaymentMethod;

  @IsOptional()
  @IsDateString()
  paidAt?: Date;

  @IsOptional()
  @IsDateString()
  renewalDueAt?: Date;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  paymentNotes?: string;

}



