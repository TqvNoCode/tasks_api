import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '@database/typeorm/entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask: Task = {
    id: 1,
    title: 'Learn NestJS basics',
    category: 'Backend',
    description: 'Explore DTO, Controller, Service, and Module',
    isCompleted: false,
    createdAt: new Date('2026-10-27T08:30:00.000Z'),
    updatedAt: new Date('2026-10-27T08:30:00.000Z'),
  };

  const mockTasksService = {
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue({
      ...mockTask,
      title: 'Learn advanced NestJS',
      isCompleted: true,
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = {
        title: 'Learn NestJS basics',
        category: 'Backend',
        description: 'Explore DTO, Controller, Service, and Module',
      };
      const result = await controller.create(dto);
      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const filterDto = { isCompleted: false, category: 'Backend' };
      const result = await controller.findAll(filterDto);
      expect(result).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return one task by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto = {
        title: 'Learn advanced NestJS',
        isCompleted: true,
      };
      const result = await controller.update('1', updateDto);
      expect(result.title).toEqual('Learn advanced NestJS');
      expect(result.isCompleted).toBe(true);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'Task deleted successfully' });
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
