import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('login')
  // login(@Body() userDTO: userDto) {
  //   return this.authService.login(userDTO.name, userDTO.password);
  // }
}
