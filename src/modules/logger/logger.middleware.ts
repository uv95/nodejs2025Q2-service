import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  async use(req: Request, res: Response, next: () => void) {
    const params = Object.keys(req.params).length
      ? ` | Query params: ${JSON.stringify(req.params)}`
      : '';
    const body = Object.keys(req.body).length
      ? ` | Body: ${JSON.stringify(req.body)}`
      : '';

    await this.logger.log(`→ ${req.method} ${req.originalUrl}${params}${body}`);

    res.on(
      'finish',
      async () =>
        res.statusCode.toString().startsWith('2') &&
        (await this.logger.log(
          `← ${req.method} ${req.originalUrl} | ${res.statusCode}`,
        )),
    );

    next();
  }
}
