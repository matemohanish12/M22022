import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskEntity } from '../entities/risk.entity';
import { RisksService } from './risks.service';
import { RisksController } from './risks.controller';

const importsArr = process.env.SKIP_DB === 'true' ? [] : [TypeOrmModule.forFeature([RiskEntity])];

@Module({ imports: importsArr, providers: [RisksService], controllers: [RisksController] })
export class RisksModule {}
