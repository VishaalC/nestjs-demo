import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './dto/user.dto';
import { v6 as uuidv6 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUser();
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: String): Promise<userDto> {
    return await this.userService.getUser(id);
  }

  @Post()
  async addUser(@Body() user: any): Promise<userDto> {
    user.UserId = uuidv6();
    user.PassWord = await bcrypt.hash(
      user.PassWord,
      parseInt(this.configService.get('SALT_ROUNDS')),
    );
    return await this.userService.addUser(user);
  }

  @Put('/:id')
  async updateUser(@Body() user: any, @Param('id') id: String): Promise<any> {
    user.PassWord = await bcrypt.hash(
      user.PassWord,
      parseInt(this.configService.get('SALT_ROUBDS')),
    );
    return await this.userService.updateUser(id, user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: String): Promise<any> {
    return await this.userService.deleteUser(id);
  }
}
