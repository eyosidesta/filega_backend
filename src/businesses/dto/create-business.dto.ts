import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

const Countries = ['CA', 'US'] as const;
type Country = (typeof Countries)[number];

const Subscriptions = ['BASIC', 'PREMIUM'] as const;
type Subscription = (typeof Subscriptions)[number];

const Statuses = ['pending', 'active'] as const;
type Status = (typeof Statuses)[number];

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

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  images?: string[];

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

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}



