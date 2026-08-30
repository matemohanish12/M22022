import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoveryPlanEntity } from '../entities/recovery-plan.entity';
import { RecoveryPlansService } from './recovery-plans.service';
import { RecoveryPlansController } from './recovery-plans.controller';

const importsArr = process.env.SKIP_DB === 'true' ? [] : [TypeOrmModule.forFeature([RecoveryPlanEntity])];

@Module({ imports: importsArr, providers: [RecoveryPlansService], controllers: [RecoveryPlansController] })
export class RecoveryPlansModule {}
