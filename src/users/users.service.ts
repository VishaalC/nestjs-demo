import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { userDto, userRequestDTO } from './dto/user.dto';
import { userResponseDTO } from './dto/userResponse.dto';
import { userDataSource } from '../database/database.providers';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class UsersService {
  constructor() {}

  async getAllUser(): Promise<any> {
    try {
      return await userDataSource.manager.query('SELECT * FROM users');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addUser(user: any): Promise<any> {
    try {
      const result = await userDataSource.manager.query(
        'INSERT INTO users Values(?, ?, ?)',
        [user?.UserId, user?.PassWord, user?.UserName],
      );
      return { id: result?.insertId, ...user };
    } catch (Error) {
      throw Error;
    }
  }

  async getUser(userId: string): Promise<userRequestDTO> {
    try {
      const result = await userDataSource.manager.query(
        'SELECT * FROM users WHERE UserId=?',
        [userId],
      );
      return result;
    } catch (Error) {
      throw Error;
    }
  }

  async updateUser(userId: string, user: userDto): Promise<userResponseDTO> {
    try {
      const result = await userDataSource.manager.query(
        'UPDATE users SET PassWord=?, UserName=? WHERE UserId=?',
        [user?.PassWord, user?.UserName, userId],
      );
      return { id: result?.insertId, UserId: userId, ...user };
    } catch (Error) {
      throw Error;
    }
  }

  async deleteUser(userId: String): Promise<ResultSetHeader> {
    try {
      return await userDataSource.manager.query(
        'DELETE FROM users WHERE UserId=?',
        [userId],
      );
    } catch (Error) {
      throw Error;
    }
  }
}
