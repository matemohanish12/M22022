import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user2.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  create(@Body() dto: CreateUserDto) { return this.svc.create(dto); }

  @Put(':id')
  replace(@Param('id') id: string, @Body() dto: CreateUserDto) { return this.svc.update(id, dto as any); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.svc.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
