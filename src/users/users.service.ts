import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { userDto, userRequestDTO } from './dto/user.dto';
import { userResponseDTO } from './dto/userResponse.dto';
import { userDataSource } from '../database/database.providers';
import { ResultSetHeader } from 'mysql2';
import { v6 as uuidv6 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async getAllUser(): Promise<userResponseDTO[]> {
    try {
      this.logger.log('GET: /users called');
      const users = await userDataSource.manager.query('SELECT * FROM users');
      if (users.length == 0) {
        this.logger.error('No Users Available');
        throw new NotFoundException('No users in table');
      } else {
        this.logger.log('Users successfully retrieved');
        return users;
      }
    } catch (error) {
      this.logger.error('Error during GET /users');
      throw error;
    }
  }

  async addUser(user: userRequestDTO): Promise<userResponseDTO> {
    try {
      this.logger.log('POST: /users called');
      user.UserId = uuidv6();
      user.PassWord = await bcrypt.hash(
        user.PassWord.valueOf(),
        parseInt(this.configService.get('SALT_ROUNDS')),
      );
      const result = await userDataSource.manager.query(
        'INSERT INTO users Values(?, ?, ?)',
        [user?.UserId, user?.PassWord, user?.UserName],
      );
      this.logger.log('User successfully added');
      return { id: result?.insertId, ...user };
    } catch (Error) {
      this.logger.error('Error during POST /users');
      throw Error;
    }
  }

  async getUser(userId: string): Promise<userResponseDTO> {
    try {
      this.logger.log('GET: /users/:id called');
      const result = await userDataSource.manager.query(
        'SELECT * FROM users WHERE UserId=?',
        [userId],
      );
      if (Object.keys(result).length == 0) {
        this.logger.error('User Not Found');
        throw new NotFoundException('UserId Not Found');
      } else {
        this.logger.log('User successfuly retrieved');
        return result;
      }
    } catch (Error) {
      this.logger.error('Error during GET /users/:id');
      throw Error;
    }
  }

  async updateUser(userId: string, user: userDto): Promise<userResponseDTO> {
    try {
      this.logger.log('UPDATE: /users called');
      user.PassWord = await bcrypt.hash(
        user.PassWord,
        parseInt(this.configService.get('SALT_ROUNDS')),
      );
      const result = await userDataSource.manager.query(
        'UPDATE users SET PassWord=?, UserName=? WHERE UserId=?',
        [user?.PassWord, user?.UserName, userId],
      );
      if (result.changedRows == 0) {
        this.logger.error('Error during Update /users');
        throw new NotFoundException('User Id Not Found');
      } else {
        this.logger.log('User Updated Successfully');
        return { id: result?.insertId, UserId: userId, ...user };
      }
    } catch (Error) {
      this.logger.error('Error during UPDATE /users');
      throw Error;
    }
  }

  async deleteUser(userId: string): Promise<ResultSetHeader> {
    try {
      this.logger.log('DELETE /users/:id called');
      const result = await userDataSource.manager.query(
        'DELETE FROM users WHERE UserId=?',
        [userId],
      );
      if (result.affectedRows == 0) {
        this.logger.error('User Not Found');
        throw new NotFoundException('User Id Not Found');
      } else {
        this.logger.log('Users Successfully deleted');
        return result;
      }
    } catch (Error) {
      this.logger.error('Error during DELETE /users/:id');
      throw Error;
    }
  }
}
