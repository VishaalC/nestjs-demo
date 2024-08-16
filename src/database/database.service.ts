import { Injectable } from '@nestjs/common';
import { createConnection, Connection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: Connection;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      this.connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'nestjsdemo',
      });
    } catch (error) {
      throw new error('Error occured while connecting to database');
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}
