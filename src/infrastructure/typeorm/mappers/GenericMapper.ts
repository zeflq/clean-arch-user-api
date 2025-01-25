import { instanceToPlain,plainToInstance } from 'class-transformer';

export class GenericMapper<Entity, Domain> {
  constructor(
    private entityClass: new (...args: any[]) => Entity,
    private domainClass: new (...args: any[]) => Domain
  ) {}

  toDomain(entity: Entity): Domain {
    return plainToInstance(this.domainClass, instanceToPlain(entity), {
      excludeExtraneousValues: true,
    }) as Domain;
  }

  toEntity(domain: Domain): Entity {
    return plainToInstance(this.entityClass, instanceToPlain(domain), {
      excludeExtraneousValues: true,
    }) as Entity;
  }
}
