import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const logger = {
  transports: [
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'DD-MM-YYYY',
      zippedArchive: false,
      maxFiles: '30d',
    }),

    new transports.DailyRotateFile({
      filename: `logs/%DATE%-info.log`,
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'DD-MM-YYYY',
      zippedArchive: false,
      maxFiles: '10d',
    }),

    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'DD-MM-YYYY',
      zippedArchive: false,
      maxFiles: '1d',
    }),
  ],
};

export const loggerInstance = createLogger(logger);
