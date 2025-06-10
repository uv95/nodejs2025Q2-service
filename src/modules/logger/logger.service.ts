import { Injectable, LoggerService } from '@nestjs/common';
import { styleText } from 'node:util';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
}

@Injectable()
export class CustomLogger implements LoggerService {
  private levels: LogLevel[] = [LogLevel.ERROR, LogLevel.WARN, LogLevel.LOG];
  private currentLevelIndex: number;

  constructor() {
    const LOG_LEVEL = process.env.LOG_LEVEL || LogLevel.LOG;
    this.currentLevelIndex = this.levels.indexOf(LOG_LEVEL as LogLevel);
  }

  private shouldLog(level: LogLevel) {
    return this.levels.indexOf(level) <= this.currentLevelIndex;
  }

  log(message: string) {
    if (this.shouldLog(LogLevel.LOG)) {
      console.log(`${styleText(['bold', 'white'], 'LOG')} ${message}`);
    }
  }

  error(message: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.log(
        `${styleText(['bold', 'red'], 'ERROR')} ${styleText(['red'], message)}`,
      );
    }
  }

  warn(message: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.log(
        `${styleText(['bold', 'yellow'], 'WARN')} ${styleText(['yellow'], message)}`,
      );
    }
  }
}
