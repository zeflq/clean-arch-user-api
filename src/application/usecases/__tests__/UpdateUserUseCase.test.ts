import MockDate from 'mockdate';
import { Container } from 'typedi';

import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';

import { ValidationError } from '../../errors/ValidationError';
import { UserService } from '../../services/UserService';
import { UpdateUserUseCase } from '../UpdateUserUseCase';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userService: UserService;

  beforeEach(() => {
    userService = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    } as any;

    Container.set(UserService, userService);
    updateUserUseCase = new UpdateUserUseCase(userService);
    MockDate.set('2025-01-25T16:05:20.375Z'); // Freeze time
  });

  afterEach(() => {
    MockDate.reset(); // Reset mocked time
  });
  it('should update user successfully', async () => {
    const userId = '1';
    const updateData = { name: 'Updated Name' };
    const existingUser = new User(userId, 'John Doe', new Email('john@example.com'), 'password123');
    const updatedUser = new User(userId, 'Updated Name', new Email('john@example.com'), 'password123');
    
    (userService.findById as jest.Mock).mockResolvedValue(existingUser);
    (userService.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(userId, updateData);

    expect(result).toEqual(updatedUser);
    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(userService.update).toHaveBeenCalledWith(userId, updatedUser);
  });

  it('should throw ValidationError when updating non-existent user', async () => {
    const userId = '999';
    const updateData = { name: 'Updated Name' };

    (userService.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateUserUseCase.execute(userId, updateData))
      .rejects
      .toThrow(ValidationError);

    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(userService.update).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when updating to existing email', async () => {
    const userId = '1';
    const updateData = { email: 'existing@example.com' };
    const existingUser = new User(userId, 'John Doe', new Email('john@example.com'), 'password123');
    const userWithEmail = new User('2', 'Other User',  new Email('existing@example.com'), 'password456');

    (userService.findById as jest.Mock).mockResolvedValue(existingUser);
    (userService.findByEmail as jest.Mock).mockResolvedValue(userWithEmail);

    await expect(updateUserUseCase.execute(userId, updateData))
      .rejects
      .toThrow(ValidationError);

    expect(userService.update).not.toHaveBeenCalled();
  });
});