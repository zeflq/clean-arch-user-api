import { Container } from 'typedi';

import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';

import { ValidationError } from '../../errors/ValidationError';
import { UserService } from '../../services/UserService';
import { DeleteUserUseCase } from '../DeleteUserUseCase';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userService: UserService;

  beforeEach(() => {
    userService = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    Container.set(UserService, userService);
    deleteUserUseCase = new DeleteUserUseCase(userService);
  });

  it('should delete user successfully', async () => {
    const userId = '1';
    const existingUser = new User(userId, 'John Doe', new Email('john@example.com'), 'password123');

    (userService.findById as jest.Mock).mockResolvedValue(existingUser);
    (userService.delete as jest.Mock).mockResolvedValue(true);

    await expect(deleteUserUseCase.execute(userId)).resolves.not.toThrow();

    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(userService.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw ValidationError when deleting non-existent user', async () => {
    const userId = '999';

    (userService.findById as jest.Mock).mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(userId))
      .rejects
      .toThrow(ValidationError);

    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(userService.delete).not.toHaveBeenCalled();
  });

  it('should throw ValidationError for invalid id', async () => {
    await expect(deleteUserUseCase.execute(''))
      .rejects
      .toThrow(ValidationError);

    expect(userService.findById).not.toHaveBeenCalled();
    expect(userService.delete).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when delete operation fails', async () => {
    const userId = '1';
    const existingUser = new User(userId, 'John Doe', new Email('john@example.com'), 'password123');

    (userService.findById as jest.Mock).mockResolvedValue(existingUser);
    (userService.delete as jest.Mock).mockResolvedValue(false);

    await expect(deleteUserUseCase.execute(userId))
      .rejects
      .toThrow(ValidationError);

    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(userService.delete).toHaveBeenCalledWith(userId);
  });
});