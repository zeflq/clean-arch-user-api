import { Inject,Service } from 'typedi';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { Email } from '@domain/value-objects/Email';

@Service()
export class UserService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async findByEmail(email: Email): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}