import { plainToInstance } from 'class-transformer';
import { Service } from 'typedi';

import { GetUserDto } from '../dtos/GetUserDto';
import { UserService } from '../services/UserService';

@Service()
export class GetAllUsersUseCase {
  constructor(private userService: UserService) {}

  async execute(): Promise<GetUserDto[]> {
    const users = await this.userService.findAll();
    return plainToInstance(GetUserDto, users, { 
      excludeExtraneousValues: true,
      enableImplicitConversion: true 
    });
  }
}