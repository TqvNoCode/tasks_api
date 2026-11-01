import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from '@database/typeorm/entities/task.entity';

@ApiTags('tasks')
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Create a new personal task',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieve a list of personal tasks with optional filtering',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tasks',
    type: Task,
    isArray: true,
  })
  async findAll(@Query() filterTaskDto: FilterTaskDto): Promise<Task[]> {
    return await this.tasksService.findAll(filterTaskDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieve detailed information of a task by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Task ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: Task,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update task information',
    description: 'Update one or more fields of a task by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Task ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Delete a task by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Task ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async remove(@Param('id') id: string) {
    await this.tasksService.delete(id);
    return { message: 'Task deleted successfully' };
  }
}
