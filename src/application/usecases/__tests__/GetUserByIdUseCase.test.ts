import { plainToInstance } from 'class-transformer';
import { Container } from 'typedi';
import 'reflect-metadata';

import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';

import { GetUserDto } from '../../dtos/GetUserDto';
import { ValidationError } from '../../errors/ValidationError';
import { UserService } from '../../services/UserService';
import { GetUserByIdUseCase } from '../GetUserByIdUseCase';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let userService: UserService;

  beforeEach(() => {
    userService = {
      findById: jest.fn(),
    } as any;

    Container.set(UserService, userService);
    getUserByIdUseCase = new GetUserByIdUseCase(userService);
  });

  it('should return user DTO when found', async () => {
    const userId = '1';
    const user = new User(userId, 'John Doe', new Email('john@example.com'), 'password123');
    const expectedDto = plainToInstance(GetUserDto, user, { excludeExtraneousValues: true, enableImplicitConversion: true  });

    (userService.findById as jest.Mock).mockResolvedValue(user);

    const result = await getUserByIdUseCase.execute(userId);

    expect(result).toEqual(expectedDto);
    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(result).not.toHaveProperty('password');
  });

  it('should throw ValidationError when user not found', async () => {
    const userId = '999';

    (userService.findById as jest.Mock).mockResolvedValue(null);

    await expect(getUserByIdUseCase.execute(userId))
      .rejects
      .toThrow(ValidationError);

    expect(userService.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw ValidationError for invalid id', async () => {
    await expect(getUserByIdUseCase.execute(''))
      .rejects
      .toThrow(ValidationError);

    expect(userService.findById).not.toHaveBeenCalled();
  });
});