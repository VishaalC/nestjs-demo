import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class userDto {
  @IsNotEmpty()
  @IsNumber()
  UserId: BigInt;

  @IsString()
  @IsNotEmpty()
  UserName: String;

  @IsString()
  @IsNotEmpty()
  PassWord: String;
}
