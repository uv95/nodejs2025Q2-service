import { Injectable, LoggerService } from '@nestjs/common';
import { colors } from 'src/utils/consts';
import { writeLogs } from 'src/utils/writeLogs';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable()
export class CustomLogger implements LoggerService {
  private levels: LogLevel[] = [
    LogLevel.ERROR,
    LogLevel.WARN,
    LogLevel.LOG,
    LogLevel.DEBUG,
    LogLevel.VERBOSE,
  ];
  private currentLevelIndex: number;

  constructor() {
    const LOG_LEVEL = process.env.LOG_LEVEL || LogLevel.LOG;
    this.currentLevelIndex = this.levels.indexOf(LOG_LEVEL as LogLevel);
  }

  private shouldLog(level: LogLevel) {
    return this.levels.indexOf(level) <= this.currentLevelIndex;
  }

  async log(message: string) {
    if (this.shouldLog(LogLevel.LOG)) {
      console.log(`${colors.magenta}[INFO]${colors.reset}: ${message}`);
      await writeLogs(`[INFO]: ${message}`);
    }
  }

  async error(message: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`${colors.red}[ERROR]${colors.reset}: ${message}`);
      await writeLogs(`[ERROR]: ${message}`);
    }
  }

  async warn(message: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.log(`${colors.yellow}[WARN]${colors.reset}: ${message}`);
      await writeLogs(`[WARN]: ${message}`);
    }
  }

  async debug(message: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`${colors.cyan}[DEBUG]${colors.reset}: ${message}`);
      await writeLogs(`[DEBUG]: ${message}`);
    }
  }

  async verbose(message: string) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      console.log(`${colors.blue}[VERBOSE]${colors.reset}: ${message}`);
      await writeLogs(`[VERBOSE]: ${message}`);
    }
  }
}
