import { instanceToPlain,plainToInstance } from 'class-transformer';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { Email } from '@domain/value-objects/Email';
import { Service } from 'typedi';
import { DataSource,Repository } from 'typeorm';

import { UserEntity } from '../entities/UserEntity';

@Service()
export class TypeOrmUserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map((entity) =>
      plainToInstance(User, instanceToPlain(entity), {
        excludeExtraneousValues: true,
      })
    );
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity
      ? plainToInstance(User, instanceToPlain(entity), {
          excludeExtraneousValues: true,
        })
      : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email: email.toString() });
    return entity
      ? plainToInstance(User, instanceToPlain(entity), {
          excludeExtraneousValues: true,
        })
      : null;
  }

  async create(user: User): Promise<User> {
    const entity = plainToInstance(UserEntity, {
      ...instanceToPlain(user),
      email: user.email.toString()
    }, {
      excludeExtraneousValues: true,
    });
    const savedEntity = await this.repository.save(entity);
    return plainToInstance(User, instanceToPlain(savedEntity), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const entityData = plainToInstance(UserEntity, {
      ...instanceToPlain(userData),
      email: userData.email?.toString()
    }, {
      excludeExtraneousValues: true,
    });
    await this.repository.update({ id }, entityData);
    const updatedEntity = await this.repository.findOneBy({ id });
    return updatedEntity
      ? plainToInstance(User, instanceToPlain(updatedEntity), {
          excludeExtraneousValues: true,
        })
      : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id });
    return result.affected ? result.affected > 0 : false;
  }
}