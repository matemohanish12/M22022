import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from '../entities/document.entity';

@Injectable()
export class DocumentsService {
  private memory: DocumentEntity[] = [];
  constructor(@Optional() @InjectRepository(DocumentEntity) private repo?: Repository<DocumentEntity>) {}
  async findAll() { if (process.env.SKIP_DB === 'true' || !this.repo) return this.memory; return this.repo.find(); }
  async findOne(id: string) { if (process.env.SKIP_DB === 'true' || !this.repo) { const e = this.memory.find(m => m.id === id); if (!e) throw new NotFoundException('Document not found'); return e; } const e = await this.repo.findOneBy({ id }); if (!e) throw new NotFoundException('Document not found'); return e; }
  async create(dto: any) { if (process.env.SKIP_DB === 'true' || !this.repo) { const id = require('crypto').randomUUID(); const d = { id, doc_key: dto.doc_key, title: dto.title } as any; this.memory.push(d); return d; } const d = this.repo.create(dto as any); return this.repo.save(d); }
  async update(id: string, dto: any) { if (process.env.SKIP_DB === 'true' || !this.repo) { const idx = this.memory.findIndex(m => m.id === id); if (idx === -1) throw new NotFoundException('Document not found'); this.memory[idx] = { ...this.memory[idx], ...dto } as any; return this.memory[idx]; } await this.repo.update(id, dto as any); return this.findOne(id); }
  async remove(id: string) { if (process.env.SKIP_DB === 'true' || !this.repo) { this.memory = this.memory.filter(m => m.id !== id); return { deleted: true }; } await this.repo.delete(id); return { deleted: true }; }
}
