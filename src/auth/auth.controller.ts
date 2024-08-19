import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto, userRequestDTO } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() userDTO: any) {
    return this.authService.login(userDTO.UserId, userDTO.PassWord);
  }
}
