import { Body, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { userDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async getAllUser(): Promise<any> {
    const connection = this.dbService.getConnection();
    const [users] = await connection.query('SELECT * FROM users');
    return users;
  }

  async addUser(user: userDto): Promise<any> {
    const connection = this.dbService.getConnection();
    const result = await connection.query(
      'INSERT INTO users Values (?, ?, ?)',
      [user?.UserId, user?.PassWord, user?.UserName],
    );
    return result;
  }
}
