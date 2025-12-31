import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdminRole } from '../admin-role.enum';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(AdminRole)
  role: AdminRole;
}


