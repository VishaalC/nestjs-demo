import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
import { loggerInstance } from 'logger/winston.logger';

export const userDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABSE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  connectTimeout: 60 * 60 * 1000,
  database: process.env.DATABASE,
});

userDataSource
  .initialize()
  .then(() => {
    loggerInstance.log({
      level: 'info',
      message: 'Database connected successfully',
    });
  })
  .catch((err) => {
    loggerInstance.log({
      level: 'error',
      message: err,
    });
  });
