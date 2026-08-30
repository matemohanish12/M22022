import { IsString, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  service_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
