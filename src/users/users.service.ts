import { Injectable } from '@nestjs/common';
import { userDto, userRequestDTO } from './dto/user.dto';
import { userResponseDTO } from './dto/userResponse.dto';
import { userDataSource } from '../database/database.providers';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class UsersService {
  constructor() {}

  async getAllUser(): Promise<userRequestDTO[]> {
    return await userDataSource.manager.query('SELECT * FROM users');
  }

  async addUser(user: userRequestDTO): Promise<userResponseDTO> {
    const result = await userDataSource.manager.query(
      'INSERT INTO users Values(?, ?, ?)',
      [user?.UserId, user?.PassWord, user?.UserName],
    );
    return { id: result?.insertId, ...user };
  }

  async getUser(userId: String): Promise<userRequestDTO> {
    const result = await userDataSource.manager.query(
      'SELECT * FROM users WHERE UserId=?',
      [userId],
    );
    return result;
  }

  async updateUser(userId: String, user: userDto): Promise<userResponseDTO> {
    const result = await userDataSource.manager.query(
      'UPDATE users SET PassWord=?, UserName=? WHERE UserId=?',
      [user?.PassWord, user?.UserName, userId],
    );
    return { id: result?.insertId, UserId: userId, ...user };
  }

  async deleteUser(userId: String): Promise<ResultSetHeader> {
    return await userDataSource.manager.query(
      'DELETE FROM users WHERE UserId=?',
      [userId],
    );
  }
}
