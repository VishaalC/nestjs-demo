import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async login(username: String, password: String): Promise<any> {
  //   const identifiedUser = await this.usersService.find(username);
  //   if (identifiedUser === undefined) {
  //     return 'Not found';
  //   } else {
  //     if (identifiedUser?.password === password) {
  //       const payload = {
  //         sub: identifiedUser.password,
  //         username: identifiedUser.name,
  //       };
  //       return {
  //         accessToken: await this.jwtService.signAsync(payload),
  //       };
  //     } else {
  //       return 'Invalid Credentials';
  //     }
  //   }
  // }
}
