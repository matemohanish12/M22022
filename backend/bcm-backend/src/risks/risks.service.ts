import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskEntity } from '../entities/risk.entity';

@Injectable()
export class RisksService {
  private memory: RiskEntity[] = [];
  constructor(@Optional() @InjectRepository(RiskEntity) private repo?: Repository<RiskEntity>) {}
  async findAll() { if (process.env.SKIP_DB === 'true' || !this.repo) return this.memory; return this.repo.find(); }
  async findOne(id: string) { if (process.env.SKIP_DB === 'true' || !this.repo) { const e = this.memory.find(m => m.id === id); if (!e) throw new NotFoundException('Risk not found'); return e; } const e = await this.repo.findOneBy({ id }); if (!e) throw new NotFoundException('Risk not found'); return e; }
  async create(dto: any) { if (process.env.SKIP_DB === 'true' || !this.repo) { const id = require('crypto').randomUUID(); const r = { id, title: dto.title, category: dto.category } as any; this.memory.push(r); return r; } const r = this.repo.create(dto as any); return this.repo.save(r); }
  async update(id: string, dto: any) { if (process.env.SKIP_DB === 'true' || !this.repo) { const idx = this.memory.findIndex(m => m.id === id); if (idx === -1) throw new NotFoundException('Risk not found'); this.memory[idx] = { ...this.memory[idx], ...dto } as any; return this.memory[idx]; } await this.repo.update(id, dto as any); return this.findOne(id); }
  async remove(id: string) { if (process.env.SKIP_DB === 'true' || !this.repo) { this.memory = this.memory.filter(m => m.id !== id); return { deleted: true }; } await this.repo.delete(id); return { deleted: true }; }
}
