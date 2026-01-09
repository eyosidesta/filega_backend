import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminRole } from '../admin-role.enum';

@Entity({ name: 'admins' })
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  role: AdminRole;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}


















