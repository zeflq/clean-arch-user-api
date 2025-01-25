import { Service } from 'typedi';
import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';

import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { ValidationError } from '../errors/ValidationError';
import { UserService } from '../services/UserService';

@Service()
export class UpdateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(id: string, userData: UpdateUserDto): Promise<User> {
    // Validate ID early on
    if (!id?.trim()) {
      throw new ValidationError('Invalid user ID');
    }

    // Fetch the existing user
    const existingUser = await this.userService.findById(id);
    if (!existingUser) {
      throw new ValidationError('User not found');
    }

    // Check if email exists and validate it if provided
    if (userData.email) {
      const email = new Email(userData.email); // Convert string to Email instance
      const userWithEmail = await this.userService.findByEmail(email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ValidationError('Email already in use');
      }
      existingUser.updateEmail(email); // Update email if necessary
    }

    if (userData.name) {
      existingUser.updateName(userData.name);
    }

    // Call the update method and return the result
    const updatedUser = await this.userService.update(existingUser.id,existingUser);
    if (!updatedUser) {
      throw new ValidationError('Failed to update user');
    }

    return updatedUser;
  }
}
