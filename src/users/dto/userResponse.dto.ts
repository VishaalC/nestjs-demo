import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class userResponseDTO {
  @IsString()
  @IsNotEmpty()
  id: String;

  @IsString()
  @IsNotEmpty()
  UserId: String;

  @IsString()
  @IsNotEmpty()
  UserName: String;

  @IsString()
  @IsNotEmpty()
  PassWord: String;
}
