import { Expose } from 'class-transformer';

export class GetUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
