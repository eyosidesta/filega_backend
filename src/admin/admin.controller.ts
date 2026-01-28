import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AdminRole } from './admin-role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { UpdateBusinessDto } from '../businesses/dto/update-business.dto';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Admin management
  @Post('admins')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN)
  createAdmin(@Req() req: any, @Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(req.adminRole, dto);
  }

  @Get('admins')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN)
  listAdmins() {
    return this.adminService.listAdmins();
  }

  @Delete('admins/:id')
  @Roles(AdminRole.MASTER_ADMIN)
  removeAdmin(@Req() req: any, @Param('id') id: string) {
    return this.adminService.removeAdmin(req.adminRole, id);
  }

  // Business moderation
  @Post('businesses')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  createBusiness(@Body() dto: CreateBusinessAdminDto) {
    return this.adminService.createBusinessByAdmin(dto);
  }

  @Get('businesses')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  listBusinesses(
    @Query()
    query: {
      status?: string;
      payment_status?: string;
      payment_method?: string;
      subscription?: string;
      city?: string;
      provinceOrState?: string;
      country?: string;
      renewalDueFrom?: string;
      renewalDueTo?: string;
    },
  ) {
    return this.adminService.listBusinesses(query);
  }

  @Get('businesses/:id')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  getBusiness(@Param('id') id: string) {
    return this.adminService.getBusiness(id);
  }

  @Patch('businesses/:id')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  updateBusiness(@Param('id') id: string, @Body() dto: UpdateBusinessDto) {
    return this.adminService.updateBusiness(id, dto);
  }

  @Patch('businesses/:id/payment')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.adminService.updatePayment(id, dto);
  }

  @Post('businesses/:id/approve')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  approveBusiness(@Param('id') id: string) {
    return this.adminService.approveBusiness(id);
  }

  @Post('businesses/:id/reject')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  rejectBusiness(@Param('id') id: string) {
    return this.adminService.rejectBusiness(id);
  }

  @Post('businesses/:id/premium')
  @Roles(AdminRole.MASTER_ADMIN, AdminRole.SUPER_ADMIN)
  setPremium(@Param('id') id: string, @Body('premium') premium: boolean) {
    return this.adminService.setPremium(id, Boolean(premium));
  }
}
