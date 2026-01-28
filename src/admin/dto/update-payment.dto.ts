import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

const PaymentStatuses = ['pending_payment', 'active', 'rejected', 'overdue'] as const;
type PaymentStatus = (typeof PaymentStatuses)[number];

const PaymentMethods = ['stripe', 'etransfer', 'cash', 'other'] as const;
type PaymentMethod = (typeof PaymentMethods)[number];

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatuses)
  payment_status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethods)
  payment_method?: PaymentMethod;

  @IsOptional()
  @IsNumber()
  paidAmountCents?: number;

  @IsOptional()
  @IsString()
  currency?: string;

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
