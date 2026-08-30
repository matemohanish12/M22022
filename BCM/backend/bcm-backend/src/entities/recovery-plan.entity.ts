import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('recovery_plans')
export class RecoveryPlanEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() plan_name: string;
  @Column({ nullable: true }) service_id: string;
  @Column({ nullable: true }) plan_owner_id: string;
  @Column({ nullable: true }) status: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
