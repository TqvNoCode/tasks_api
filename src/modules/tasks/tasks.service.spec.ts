import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@database/typeorm/entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskRepository: any;

  const mockTask1: Task = {
    id: 1,
    title: 'Learn NestJS basics',
    category: 'Backend',
    description: 'Explore DTO, Controller, Service, and Module',
    isCompleted: false,
    createdAt: new Date('2026-10-27T08:30:00.000Z'),
    updatedAt: new Date('2026-10-27T08:30:00.000Z'),
  };

  const mockTask2: Task = {
    id: 2,
    title: 'Build REST API',
    category: 'Backend',
    description: 'Implement CRUD endpoints',
    isCompleted: true,
    createdAt: new Date('2026-10-27T09:00:00.000Z'),
    updatedAt: new Date('2026-10-27T09:00:00.000Z'),
  };

  beforeEach(async () => {
    let nextId = 1;
    mockTaskRepository = {
      create: jest.fn().mockImplementation((dto) => ({
        ...dto,
      })),
      save: jest.fn().mockImplementation((task) => {
        if (!task.id) {
          return Promise.resolve({
            id: nextId++,
            createdAt: new Date('2026-10-27T08:30:00.000Z'),
            updatedAt: new Date('2026-10-27T08:30:00.000Z'),
            ...task,
          });
        }
        return Promise.resolve(task);
      }),
      findOneBy: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a task with default isCompleted = false', async () => {
      const dto = {
        title: 'Learn NestJS basics',
        category: 'Backend',
        description: 'Explore DTO, Controller, Service, and Module',
      };

      const result = await service.create(dto);
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        category: dto.category,
        description: dto.description,
        isCompleted: false,
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.title).toEqual(dto.title);
      expect(result.isCompleted).toBe(false);
    });

    it('should create a task with provided isCompleted', async () => {
      const dto = {
        title: 'Build REST API',
        isCompleted: true,
      };

      const result = await service.create(dto);
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        category: undefined,
        description: undefined,
        isCompleted: true,
      });
      expect(result.isCompleted).toBe(true);
    });

    it('should ensure newly created tasks get a new ID and do not overwrite old tasks', async () => {
      const firstTask = await service.create({
        title: 'First task',
      });
      const secondTask = await service.create({
        title: 'Second task',
      });

      expect(firstTask.id).toBe(1);
      expect(secondTask.id).toBe(2);
      expect(firstTask.title).toBe('First task');
      expect(secondTask.title).toBe('Second task');
      expect(secondTask.id).not.toEqual(firstTask.id);
    });
  });

  describe('findAll', () => {
    let queryBuilder: any;

    beforeEach(() => {
      queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTask1, mockTask2]),
      };
      mockTaskRepository.createQueryBuilder.mockReturnValue(queryBuilder);
    });

    it('should return all tasks without filter', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTask1, mockTask2]);
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('task.id', 'ASC');
    });

    it('should filter tasks when isCompleted is false (boolean)', async () => {
      await service.findAll({ isCompleted: false });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.isCompleted = :isCompleted',
        { isCompleted: false },
      );
    });

    it('should filter tasks when isCompleted is true (boolean)', async () => {
      await service.findAll({ isCompleted: true });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.isCompleted = :isCompleted',
        { isCompleted: true },
      );
    });

    it('should filter tasks when isCompleted is "false" (string)', async () => {
      await service.findAll({ isCompleted: 'false' as any });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.isCompleted = :isCompleted',
        { isCompleted: false },
      );
    });

    it('should filter tasks when isCompleted is "true" (string)', async () => {
      await service.findAll({ isCompleted: 'true' as any });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.isCompleted = :isCompleted',
        { isCompleted: true },
      );
    });

    it('should filter tasks by category', async () => {
      await service.findAll({ category: 'Backend' });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.category = :category',
        { category: 'Backend' },
      );
    });

    it('should combine isCompleted and category filters', async () => {
      await service.findAll({
        isCompleted: false,
        category: 'Backend',
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.isCompleted = :isCompleted',
        { isCompleted: false },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'task.category = :category',
        { category: 'Backend' },
      );
    });

    it('should not filter when isCompleted is undefined or empty string', async () => {
      await service.findAll({ isCompleted: '' as any, category: '' });
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(mockTask1);

      const result = await service.findOne(mockTask1.id);
      expect(result).toEqual(mockTask1);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({
        id: mockTask1.id,
      });
    });

    it('should throw NotFoundException if task not found with valid numeric ID', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Tasks with ID 999 not found'),
      );
    });

    it('should throw NotFoundException if id is not a valid integer format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('Tasks with ID invalid-id not found'),
      );
      expect(mockTaskRepository.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue({ ...mockTask1 });

      const updateDto = {
        title: 'Learn advanced NestJS',
        isCompleted: true,
      };

      const result = await service.update(mockTask1.id, updateDto);
      expect(result.title).toEqual('Learn advanced NestJS');
      expect(result.isCompleted).toBe(true);
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(mockTask1.id, { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete existing task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(mockTask1);

      await service.delete(mockTask1.id);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(mockTask1.id);
    });

    it('should throw NotFoundException when deleting non-existent task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(mockTask1.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
