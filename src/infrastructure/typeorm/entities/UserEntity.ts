import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  // Shared ID for SQL and MongoDB
  @PrimaryGeneratedColumn('uuid')  // For SQL databases
  @ObjectIdColumn()                // For MongoDB
  @Expose({ name: '_id' })         // Maps _id to id in responses
  @Transform(({ value }) =>
    value instanceof ObjectId ? value.toHexString() : value,
    { toPlainOnly: true}
  )
  id: string;

  @Column({ unique: true })
  @Index()
  @Expose()
  email: string;

  @Column()
  @Expose()
  name!: string;

  @Column({ nullable: false })
  @Expose()
  password!: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date; 

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date; 
}
