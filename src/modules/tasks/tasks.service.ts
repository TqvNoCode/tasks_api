import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@database/typeorm/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      category: createTaskDto.category,
      description: createTaskDto.description,
      isCompleted: createTaskDto.isCompleted ?? false,
    });
    delete (task as any).id;
    return await this.taskRepository.save(task);
  }

  async findAll(filterTaskDto?: FilterTaskDto): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');

    if (
      filterTaskDto?.isCompleted !== undefined &&
      filterTaskDto?.isCompleted !== null &&
      (filterTaskDto.isCompleted as any) !== ''
    ) {
      let isCompleted: boolean | undefined = undefined;
      if (typeof filterTaskDto.isCompleted === 'boolean') {
        isCompleted = filterTaskDto.isCompleted;
      } else if (typeof filterTaskDto.isCompleted === 'string') {
        const val = (filterTaskDto.isCompleted as string).trim().toLowerCase();
        if (val === 'true' || val === '1') {
          isCompleted = true;
        } else if (val === 'false' || val === '0') {
          isCompleted = false;
        }
      }

      if (isCompleted !== undefined) {
        query.andWhere('task.isCompleted = :isCompleted', {
          isCompleted,
        });
      }
    }

    if (filterTaskDto?.category && filterTaskDto.category.trim() !== '') {
      query.andWhere('task.category = :category', {
        category: filterTaskDto.category.trim(),
      });
    }

    query.orderBy('task.id', 'ASC');
    return await query.getMany();
  }

  async findOne(id: number | string): Promise<Task> {
    const numericId = typeof id === 'number' ? id : Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }

    const task = await this.taskRepository.findOneBy({ id: numericId });
    if (!task) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }

    return task;
  }

  async update(
    id: number | string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.category !== undefined) {
      task.category = updateTaskDto.category;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.isCompleted !== undefined) {
      task.isCompleted = updateTaskDto.isCompleted;
    }

    return await this.taskRepository.save(task);
  }

  async delete(id: number | string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.delete(task.id);
  }
}
