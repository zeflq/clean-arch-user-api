
import { plainToInstance } from 'class-transformer';
import { Container } from 'typedi';
import 'reflect-metadata';

import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';

import { GetUserDto } from '../../dtos/GetUserDto';
import { UserService } from '../../services/UserService';
import { GetAllUsersUseCase } from '../GetAllUsersUseCase';

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase;
  let userService: UserService;

  beforeEach(() => {
    userService = {
      findAll: jest.fn(),
    } as any;

    Container.set(UserService, userService);
    getAllUsersUseCase = new GetAllUsersUseCase(userService);
  });

  it('should return all users as DTOs', async () => {
    const users = [
      new User('1', 'John Doe', new Email('john@example.com'), 'password123'),
      new User('2', 'Jane Doe', new Email('jane@example.com'), 'password456'),
    ];

      true 
    const expectedDtos = plainToInstance(GetUserDto, users, { excludeExtraneousValues: true ,enableImplicitConversion: true });

    (userService.findAll as jest.Mock).mockResolvedValue(users);

    const result = await getAllUsersUseCase.execute();

    expect(result).toEqual(expectedDtos);
    expect(userService.findAll).toHaveBeenCalled();
    expect(result[0]).not.toHaveProperty('password');
  });

  it('should return empty array when no users exist', async () => {
    (userService.findAll as jest.Mock).mockResolvedValue([]);

    const result = await getAllUsersUseCase.execute();

    expect(result).toEqual([]);
    expect(userService.findAll).toHaveBeenCalled();
  });
});