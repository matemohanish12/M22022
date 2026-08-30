import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';

const importsArr = process.env.SKIP_DB === 'true' ? [] : [TypeOrmModule.forFeature([DocumentEntity])];

@Module({ imports: importsArr, providers: [DocumentsService], controllers: [DocumentsController] })
export class DocumentsModule {}
