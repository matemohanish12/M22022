import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { DocumentsModule } from './documents/documents.module';
import { RisksModule } from './risks/risks.module';
import { RecoveryPlansModule } from './recovery-plans/recovery-plans.module';

const importsArray = [
  ...(process.env.SKIP_DB === 'true' ? [] : [TypeOrmModule.forRoot(typeOrmConfig)]),
  UsersModule,
  ServicesModule,
  DocumentsModule,
  RisksModule,
  RecoveryPlansModule,
];

@Module({
  imports: importsArray,
})
export class AppModule {}
