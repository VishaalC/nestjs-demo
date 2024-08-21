import { IsNotEmpty, IsOptional } from 'class-validator';

export class userDto {
  @IsNotEmpty()
  UserName: string;

  @IsNotEmpty()
  PassWord: string;
}

export class userRequestDTO {
  @IsOptional()
  UserId: string;

  @IsNotEmpty()
  UserName: string;

  @IsNotEmpty()
  PassWord: string;
}
