import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { isStringObject } from 'util/types';

export class userDto {
  @IsNotEmpty()
  UserName: string;

  @IsNotEmpty()
  PassWord: string;
}

export class userRequestDTO {
  @IsNotEmpty()
  UserId: string;

  @IsNotEmpty()
  UserName: string;

  @IsNotEmpty()
  PassWord: string;
}
