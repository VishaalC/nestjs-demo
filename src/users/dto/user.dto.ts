import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class userDto {
  @IsString()
  @IsNotEmpty()
  UserName: String;

  @IsString()
  @IsNotEmpty()
  PassWord: String;
}

export class userRequestDTO {
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
