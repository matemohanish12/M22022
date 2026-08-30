import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

const importsArr = process.env.SKIP_DB === 'true' ? [] : [TypeOrmModule.forFeature([User])];

@Module({ imports: importsArr, providers: [UsersService], controllers: [UsersController], exports: [UsersService] })
export class UsersModule {}
