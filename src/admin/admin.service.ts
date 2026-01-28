import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRole } from './admin-role.enum';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { BusinessesService } from '../businesses/businesses.service';
import { Business } from '../businesses/entities/business.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    private readonly businessesService: BusinessesService,
  ) {}

  async createAdmin(requesterRole: AdminRole, dto: CreateAdminDto) {
    if (requesterRole === AdminRole.SUPER_ADMIN && dto.role === AdminRole.MASTER_ADMIN) {
      throw new ForbiddenException('SUPER_ADMIN cannot create MASTER_ADMIN');
    }
    const admin = this.repo.create({ ...dto, active: true });
    return this.repo.save(admin);
  }

  async listAdmins() {
    return this.repo.find();
  }

  async removeAdmin(requesterRole: AdminRole, id: string) {
    if (requesterRole !== AdminRole.MASTER_ADMIN) {
      throw new ForbiddenException('Only MASTER_ADMIN can delete admins');
    }
    const target = await this.repo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('Admin not found');
    if (target.role === AdminRole.MASTER_ADMIN && requesterRole !== AdminRole.MASTER_ADMIN) {
      throw new ForbiddenException('Cannot delete MASTER_ADMIN');
    }
    await this.repo.remove(target);
    return { deleted: true };
  }

  async approveBusiness(id: string) {
    return this.businessesService.update(id, { status: 'active' as any });
  }

  async rejectBusiness(id: string) {
    // With current statuses (pending/active), set back to pending
    return this.businessesService.update(id, { status: 'pending' as any });
  }

  async setPremium(id: string, premium: boolean) {
    return this.businessesService.update(id, { subscription: premium ? 'PREMIUM' : 'BASIC' });
  }

  async createBusinessByAdmin(dto: CreateBusinessAdminDto) {
    const created = await this.businessesService.create(dto);

    const updates: Partial<Business> = {};
    if (dto.status) updates.status = dto.status as Business['status'];
    if (dto.payment_status) updates.payment_status = dto.payment_status;
    if (dto.payment_method) updates.payment_method = dto.payment_method;
    if (dto.paidAmountCents !== undefined) updates.paidAmountCents = dto.paidAmountCents;
    if (dto.currency !== undefined) updates.currency = dto.currency;
    if (dto.paidAt) updates.paidAt = new Date(dto.paidAt);
    if (dto.renewalDueAt) updates.renewalDueAt = new Date(dto.renewalDueAt);
    if (dto.paymentReference !== undefined) updates.paymentReference = dto.paymentReference;
    if (dto.paymentNotes !== undefined) updates.paymentNotes = dto.paymentNotes;

    if (updates.payment_status === 'active' && !updates.paidAt) {
      updates.paidAt = new Date();
    }
    if (updates.payment_status === 'active' && !updates.renewalDueAt) {
      updates.renewalDueAt = this.calculateRenewalDueAt(updates.paidAt as Date);
    }

    if (Object.keys(updates).length > 0) {
      return this.businessesService.update(created.id, updates);
    }

    return created;
  }

  async listBusinesses(filters: Record<string, string | undefined>) {
    const qb = this.businessRepo.createQueryBuilder('business');

    if (filters.status) {
      qb.andWhere('business.status = :status', { status: filters.status });
    }
    if (filters.payment_status) {
      qb.andWhere('business.payment_status = :payment_status', {
        payment_status: filters.payment_status,
      });
    }
    if (filters.payment_method) {
      qb.andWhere('business.payment_method = :payment_method', {
        payment_method: filters.payment_method,
      });
    }
    if (filters.subscription) {
      qb.andWhere('business.subscription = :subscription', {
        subscription: filters.subscription,
      });
    }
    if (filters.city) {
      qb.andWhere('business.city = :city', { city: filters.city });
    }
    if (filters.provinceOrState) {
      qb.andWhere('business.provinceOrState = :provinceOrState', {
        provinceOrState: filters.provinceOrState,
      });
    }
    if (filters.country) {
      qb.andWhere('business.country = :country', { country: filters.country });
    }
    if (filters.renewalDueFrom) {
      qb.andWhere('business.renewalDueAt >= :renewalDueFrom', {
        renewalDueFrom: new Date(filters.renewalDueFrom),
      });
    }
    if (filters.renewalDueTo) {
      qb.andWhere('business.renewalDueAt <= :renewalDueTo', {
        renewalDueTo: new Date(filters.renewalDueTo),
      });
    }

    return qb.orderBy('business.createdAt', 'DESC').getMany();
  }

  async getBusiness(id: string) {
    const business = await this.businessRepo.findOne({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async updateBusiness(id: string, dto: Partial<Business>) {
    return this.businessesService.update(id, dto);
  }

  private calculateRenewalDueAt(paidAt?: Date) {
    if (!paidAt) return undefined;
    const renewalDueAt = new Date(paidAt);
    renewalDueAt.setFullYear(renewalDueAt.getFullYear() + 1);
    return renewalDueAt;
  }

  async updatePayment(id: string, dto: UpdatePaymentDto) {
    const updates: Partial<Business> = { ...dto };

    if (dto.payment_status === 'active' && !dto.paidAt) {
      updates.paidAt = new Date();
    }

    if (dto.payment_status === 'active' && !dto.renewalDueAt) {
      updates.renewalDueAt = this.calculateRenewalDueAt(updates.paidAt as Date);
    }

    return this.businessesService.update(id, updates);
  }
}


















