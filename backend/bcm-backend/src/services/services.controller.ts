import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: CreateServiceDto) { return this.svc.create(dto); }
  @Put(':id') replace(@Param('id') id: string, @Body() dto: CreateServiceDto) { return this.svc.update(id, dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
