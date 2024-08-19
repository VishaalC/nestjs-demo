import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

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
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
