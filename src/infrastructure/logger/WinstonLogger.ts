import { ILogger } from '@core/interfaces/ILogger';
import expressWinston from 'express-winston';
import winston from 'winston';

export class WinstonLogger implements ILogger {
  private static instance: WinstonLogger;
  private logger: winston.Logger;

  private constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}]::${level}::${message}`;
        })
      ),
      transports: [new winston.transports.Console()],
    });
  }

  public static getInstance(): WinstonLogger {
    if (!WinstonLogger.instance) {
      WinstonLogger.instance = new WinstonLogger();
    }
    return WinstonLogger.instance;
  }

  public logInfo(message: string, context: Record<string, any> = {}): void {
    this.logger.info(message, context);
  }

  public logError(message: string, context: Record<string, any> = {}): void {
    this.logger.error(message, context);
  }

  public get expressLogger() {
    return expressWinston.logger({
      winstonInstance: this.logger,
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}}',
      expressFormat: true,
      colorize: false,
    });
  }
}
