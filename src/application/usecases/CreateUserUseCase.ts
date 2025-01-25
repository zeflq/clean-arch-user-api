import { Service } from 'typedi';
import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserDto } from '../dtos/CreateUserDto';
import { BusinessError } from '../errors/BusinessError';
import { UserService } from '../services/UserService';

@Service()
export class CreateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const email = new Email(createUserDto.email);
    await this.validateBusinessRules(createUserDto, email);

    const user = new User(
      uuidv4(),
      createUserDto.name,
      email,
      createUserDto.password
    );

    return this.userService.create(user);
  }

  private async validateBusinessRules(dto: CreateUserDto, email: Email): Promise<void> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BusinessError('User with this email already exists');
    }

    if (dto.password.includes(dto.name)) {
      throw new BusinessError('Password cannot contain user name');
    }

    if (dto.email.endsWith('tempmail.com')) {
      throw new BusinessError('Temporary email providers are not allowed');
    }
  }
}