import { IsNotEmpty } from 'class-validator';

export class userResponseDTO {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  UserId: string;

  @IsNotEmpty()
  UserName: string;

  @IsNotEmpty()
  PassWord: string;
}
