import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(UserId: string, PassWord: string): Promise<any> {
    const identifiedUser = await this.usersService.getUser(UserId);
    if (identifiedUser === undefined) {
      return 'Not found';
    } else {
      const isMatch = await bcrypt.compare(
        PassWord,
        identifiedUser[0]?.PassWord,
      );
      if (isMatch) {
        const payload = {
          sub: identifiedUser.PassWord,
          username: identifiedUser.PassWord,
        };
        return {
          accessToken: await this.jwtService.signAsync(payload),
        };
      } else {
        return 'Invalid Credentials';
      }
    }
  }
}
