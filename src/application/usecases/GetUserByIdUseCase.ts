import { plainToInstance } from 'class-transformer';
import { Service } from 'typedi';

import { GetUserDto } from '../dtos/GetUserDto';
import { ValidationError } from '../errors/ValidationError';
import { UserService } from '../services/UserService';

@Service()
export class GetUserByIdUseCase {
  constructor(private userService: UserService) {}

  async execute(id: string): Promise<GetUserDto> {
    if (!id || id.trim().length === 0) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    return plainToInstance(GetUserDto, user, { excludeExtraneousValues: true ,enableImplicitConversion: true });
  }
}