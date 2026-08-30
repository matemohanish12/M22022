import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  private memory: ServiceEntity[] = [];
  constructor(@Optional() @InjectRepository(ServiceEntity) private repo?: Repository<ServiceEntity>) {}
  async findAll() { if (process.env.SKIP_DB === 'true' || !this.repo) return this.memory; return this.repo.find(); }
  async findOne(id: string) { if (process.env.SKIP_DB === 'true' || !this.repo) { const e = this.memory.find(m => m.id === id); if (!e) throw new NotFoundException('Service not found'); return e; } const e = await this.repo.findOneBy({ id }); if (!e) throw new NotFoundException('Service not found'); return e; }
  async create(dto: CreateServiceDto) { if (process.env.SKIP_DB === 'true' || !this.repo) { const id = require('crypto').randomUUID(); const s = { id, service_id: dto.service_id, name: dto.name, description: dto.description } as any; this.memory.push(s); return s; } const s = this.repo.create(dto as any); return this.repo.save(s); }
  async update(id: string, dto: any) { if (process.env.SKIP_DB === 'true' || !this.repo) { const idx = this.memory.findIndex(m => m.id === id); if (idx === -1) throw new NotFoundException('Service not found'); this.memory[idx] = { ...this.memory[idx], ...dto } as any; return this.memory[idx]; } await this.repo.update(id, dto as any); return this.findOne(id); }
  async remove(id: string) { if (process.env.SKIP_DB === 'true' || !this.repo) { this.memory = this.memory.filter(m => m.id !== id); return { deleted: true }; } await this.repo.delete(id); return { deleted: true }; }
}
