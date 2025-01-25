import { Service } from 'typedi';

import { ValidationError } from '../errors/ValidationError';
import { UserService } from '../services/UserService';

@Service()
export class DeleteUserUseCase {
  constructor(private userService: UserService) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const deleted = await this.userService.delete(id);
    if (!deleted) {
      throw new ValidationError('Failed to delete user');
    }
  }
}