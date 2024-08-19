import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './dto/user.dto';
import { v6 as uuidv6 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { userResponseDTO } from './dto/userResponse.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAllUsers() {
    try {
      const result = await this.userService.getAllUser();
      if (result.length == 0) {
        throw new HttpException('Resource Not Found', HttpStatus.NOT_FOUND);
      } else {
        return await this.userService.getAllUser();
      }
    } catch (Error) {
      throw Error;
    }
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: string): Promise<userDto> {
    const result = await this.userService.getUser(id);
    try {
      if (Object.keys(result).length == 0) {
        throw new NotFoundException();
      } else {
        return result;
      }
    } catch (Error) {
      throw Error;
    }
  }

  @Post()
  async addUser(@Body() user: any): Promise<userResponseDTO> {
    try {
      user.UserId = uuidv6();
      user.PassWord = await bcrypt.hash(
        user.PassWord.valueOf(),
        parseInt(this.configService.get('SALT_ROUNDS')),
      );
      return await this.userService.addUser(user);
    } catch (Error) {
      throw Error;
    }
  }

  @Put('/:id')
  async updateUser(@Body() user: any, @Param('id') id: string): Promise<any> {
    try {
      user.PassWord = await bcrypt.hash(
        user.PassWord,
        parseInt(this.configService.get('SALT_ROUBDS')),
      );
      return await this.userService.updateUser(id, user);
    } catch (Error) {
      throw Error;
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: String): Promise<any> {
    try {
      return await this.userService.deleteUser(id);
    } catch (Error) {
      throw Error;
    }
  }
}
