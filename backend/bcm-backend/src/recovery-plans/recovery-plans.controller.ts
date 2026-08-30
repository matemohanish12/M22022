import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { RecoveryPlansService } from './recovery-plans.service';

@Controller('recovery-plans')
export class RecoveryPlansController {
  constructor(private readonly svc: RecoveryPlansService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: any) { return this.svc.create(dto); }
  @Put(':id') replace(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
