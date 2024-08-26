import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import logger, { metaLogFormatter } from 'logger/winston.logger';
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
    logger.info('Database connected');
  })
  .catch((err) => {
    logger.error('AI-MGNCC-PRM-100: Internal server error', err, {
      meta: metaLogFormatter(
        'AI-MNGCC-PRM-100',
        `Internal server error ${err}`,
        '500',
        '/premium',
        null,
      ),
    });
  });
