import { Exclude, Expose, Transform } from 'class-transformer';

import { Email } from '../value-objects/Email';

export class User {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
  @Transform(({ value }) => value, { toPlainOnly: true })
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Transform(({ value }) => new Email(value), { toClassOnly: true })
  email: Email;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: Email,
    password: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  updateEmail(email: Email): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}