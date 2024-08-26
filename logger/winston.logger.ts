import { format, transports, createLogger } from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, printf } = format;
import { join } from 'path';

const myFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${JSON.stringify(meta.meta)}`;
});

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      format: combine(timestamp(), myFormat),
      level: 'error',
      filename: `logs/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.Console(),
  ],
});

export default logger;
export function metaLogFormatter(
  code,
  error,
  httpErrorCode,
  httpEndpoint,
  additionalInfo,
) {
  const meta = { CODE: code };
  if (error) {
    meta['error'] = error;
  }
  if (httpErrorCode) {
    meta['HTTP_ERRORCODE'] = httpErrorCode;
  }
  if (httpEndpoint) {
    meta['HTTP_ENDPOINT'] = httpEndpoint;
  }
  if (process.env.ENVIRONMENT) {
    meta['ENVIRONMENT'] = process.env.ENVIRONMENT;
  }
  return { ...meta, ...additionalInfo };
}
