import { IsNotEmpty } from 'class-validator';

export class authDTO {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
