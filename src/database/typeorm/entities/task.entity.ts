import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @ApiProperty({
    example: 1,
    description: 'Task ID',
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty({
    example: 'Learn NestJS basics',
    description: 'Task title',
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiPropertyOptional({
    example: 'Backend',
    description: 'Task category',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  category?: string;

  @ApiPropertyOptional({
    example: 'Explore DTO, Controller, Service, and Module',
    description: 'Detailed task description',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Task completion status',
    default: false,
  })
  @Column({ type: 'boolean', default: false, name: 'is_completed' })
  isCompleted: boolean;

  @ApiProperty({
    example: '2026-10-27T08:30:00.000Z',
    description: 'Task creation timestamp',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-10-27T08:30:00.000Z',
    description: 'Task update timestamp',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;
}
