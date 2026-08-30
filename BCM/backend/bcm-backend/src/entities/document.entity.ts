import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) doc_key: string;
  @Column() title: string;
  @Column({ nullable: true }) doc_type: string;
  @Column({ nullable: true }) owner_id: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
