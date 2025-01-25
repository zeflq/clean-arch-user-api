
import { Container } from 'typedi';

import { User } from '@domain/entities/User';
import { Email } from '@domain/value-objects/Email';


import { BusinessError } from '../../errors/BusinessError';
import { UserService } from '../../services/UserService';
import { CreateUserUseCase } from '../CreateUserUseCase';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userService: UserService;

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    Container.set(UserService, userService);
    createUserUseCase = new CreateUserUseCase(userService);
  });

  it('should create a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const expectedUser = new User('1', userData.name, new Email(userData.email), userData.password);
    
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (userService.create as jest.Mock).mockResolvedValue(expectedUser);

    const result = await createUserUseCase.execute(userData);

    expect(result).toEqual(expectedUser);
    expect(userService.findByEmail).toHaveBeenCalledWith(new Email(userData.email));
    expect(userService.create).toHaveBeenCalled();
  });

  it('should throw BusinessError if email already exists', async () => {
    const userData = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123'
    };

    (userService.findByEmail as jest.Mock).mockResolvedValue(new User('1', 'Existing User',new Email(userData.email), 'password'));

    await expect(createUserUseCase.execute(userData))
      .rejects
      .toThrow(BusinessError);

    expect(userService.findByEmail).toHaveBeenCalledWith(new Email(userData.email));
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('should throw BusinessError if password contains username', async () => {
    const userData = {
      name: 'John',
      email: 'john@example.com',
      password: 'myJohnpassword'
    };

    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(createUserUseCase.execute(userData))
      .rejects
      .toThrow(BusinessError);

    expect(userService.create).not.toHaveBeenCalled();
  });
});