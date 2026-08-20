// app/api/callback/utils/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private context: string;

  private constructor(context: string = 'PaymentCallback') {
    this.context = context;
  }

  static getInstance(context?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context);
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(data && { data })
    };

    if (level === 'error') {
      console.error(JSON.stringify(logEntry, null, 2));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logEntry, null, 2));
    } else {
      console.log(JSON.stringify(logEntry, null, 2));
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export const createLogger = (context?: string) => Logger.getInstance(context);