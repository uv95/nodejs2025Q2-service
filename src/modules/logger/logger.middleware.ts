import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { colors } from 'src/utils/consts';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: () => void) {
    const params = Object.keys(req.params).length
      ? ` | Query params: ${colors.yellow}${JSON.stringify(req.params)}${colors.reset}`
      : '';
    const body = Object.keys(req.body).length
      ? ` | Body: ${colors.yellow}${JSON.stringify(req.body)}${colors.reset}`
      : '';

    this.logger.log(
      `${colors.blue}→${colors.reset} ${colors.yellow}${req.method} ${req.originalUrl}${colors.reset}${params}${body}`,
    );

    res.on('finish', () =>
      this.logger.log(
        `${colors.blue}←${colors.reset} ${colors.yellow}${req.method} ${req.originalUrl}${colors.reset} | ${colors[res.statusCode.toString().startsWith('2') ? 'green' : 'red']}${res.statusCode}${colors.reset}`,
      ),
    );

    next();
  }
}
