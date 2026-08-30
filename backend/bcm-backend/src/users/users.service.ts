import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user2.dto';

@Injectable()
export class UsersService {
  private memory: User[] = [];
  constructor(@Optional() @InjectRepository(User) private repo?: Repository<User>) {}

  async findAll() {
    if (process.env.SKIP_DB === 'true' || !this.repo) return this.memory;
    return this.repo.find();
  }

  async findOne(id: string) {
    if (process.env.SKIP_DB === 'true' || !this.repo) {
      const e = this.memory.find(m => m.id === id);
      if (!e) throw new NotFoundException('User not found');
      return e;
    }
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new NotFoundException('User not found');
    return e;
  }

  async create(dto: CreateUserDto) {
    if (process.env.SKIP_DB === 'true' || !this.repo) {
      const id = require('crypto').randomUUID();
      const u = { id, username: dto.username, email: dto.email, full_name: dto.full_name, enabled: true } as any;
      this.memory.push(u);
      return u;
    }
    const u = this.repo.create(dto as any);
    return this.repo.save(u);
  }

  async update(id: string, dto: UpdateUserDto) {
    if (process.env.SKIP_DB === 'true' || !this.repo) {
      const idx = this.memory.findIndex(m => m.id === id);
      if (idx === -1) throw new NotFoundException('User not found');
      this.memory[idx] = { ...this.memory[idx], ...dto } as any;
      return this.memory[idx];
    }
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    if (process.env.SKIP_DB === 'true' || !this.repo) {
      this.memory = this.memory.filter(m => m.id !== id);
      return { deleted: true };
    }
    await this.repo.delete(id);
    return { deleted: true };
  }
}
