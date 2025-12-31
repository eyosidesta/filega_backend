import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRole } from './admin-role.enum';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
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
}


