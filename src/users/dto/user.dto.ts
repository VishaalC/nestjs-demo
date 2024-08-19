import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { isStringObject } from 'util/types';

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
