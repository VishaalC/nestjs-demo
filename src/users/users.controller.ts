import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUser();
  }

  @Post()
  async addUser(@Body() user: userDto) {
    return await this.userService.addUser(user);
  }
}
