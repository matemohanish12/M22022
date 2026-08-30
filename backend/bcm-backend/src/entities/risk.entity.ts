import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('risk_register')
export class RiskEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true, nullable: true }) risk_id: string;
  @Column() title: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true, type: 'text' }) description: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
