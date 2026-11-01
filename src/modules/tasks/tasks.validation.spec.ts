import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

describe('Tasks DTO Validation', () => {
  describe('CreateTaskDto', () => {
    it('should pass with valid data', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: 'Learn NestJS basics',
        category: 'Backend',
        description: 'Explore DTO, Controller, Service, and Module',
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when title is missing', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        category: 'Backend',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail when title is empty', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: '',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail when title exceeds 255 characters', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: 'a'.repeat(256),
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail when isCompleted is not a boolean', async () => {
      const dto = plainToInstance(CreateTaskDto, {
        title: 'Valid title',
        isCompleted: 'not-a-bool' as any,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('isCompleted');
    });
  });

  describe('UpdateTaskDto', () => {
    it('should pass with empty object (all fields optional)', async () => {
      const dto = plainToInstance(UpdateTaskDto, {});
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with partial update', async () => {
      const dto = plainToInstance(UpdateTaskDto, {
        title: 'Learn advanced NestJS',
        isCompleted: true,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when provided title is empty', async () => {
      const dto = plainToInstance(UpdateTaskDto, {
        title: '',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail when provided title is not a string', async () => {
      const dto = plainToInstance(UpdateTaskDto, {
        title: 12345 as any,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });
  });

  describe('FilterTaskDto', () => {
    it('should transform "true" string to boolean true', async () => {
      const dto = plainToInstance(FilterTaskDto, {
        isCompleted: 'true',
        category: 'Backend',
      });
      expect(dto.isCompleted).toBe(true);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should transform "false" string to boolean false', async () => {
      const dto = plainToInstance(FilterTaskDto, {
        isCompleted: 'false',
      });
      expect(dto.isCompleted).toBe(false);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should transform empty string to undefined so optional validation passes', async () => {
      const dto = plainToInstance(FilterTaskDto, {
        isCompleted: '',
        category: '',
      });
      expect(dto.isCompleted).toBeUndefined();
      expect(dto.category).toBeUndefined();
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if isCompleted cannot be coerced to boolean', async () => {
      const dto = plainToInstance(FilterTaskDto, {
        isCompleted: 'not-bool',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('isCompleted');
    });
  });
});
