import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Learn NestJS basics',
    description: 'Task title, length: 1 - 255 characters',
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiPropertyOptional({
    example: 'Backend',
    description: 'Task category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'Explore DTO, Controller, Service, and Module',
    description: 'Detailed task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Task completion status, defaults to false',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
