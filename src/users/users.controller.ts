import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto, userRequestDTO } from './dto/user.dto';
import { userResponseDTO } from './dto/userResponse.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers(): Promise<userResponseDTO[]> {
    return await this.userService.getAllUser();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getOneUser(@Param('id') id: string): Promise<userResponseDTO> {
    return await this.userService.getUser(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async addUser(@Body() user: userRequestDTO): Promise<userResponseDTO> {
    return await this.userService.addUser(user);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateUser(
    @Body() user: userDto,
    @Param('id') id: string,
  ): Promise<userResponseDTO> {
    return await this.userService.updateUser(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteUser(id);
  }
}
