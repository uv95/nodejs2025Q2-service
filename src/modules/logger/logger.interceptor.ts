import {
  CallHandler,
  ExecutionContext,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { colors } from 'src/utils/consts';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const url = Reflect.getMetadata('path', context.getClass());
    const now = Date.now();

    const params = Object.keys(req.params).length
      ? ` | Query params: ${colors.yellow}${JSON.stringify(req.params)}${colors.reset}`
      : '';
    const body = Object.keys(req.body).length
      ? ` | Body: ${colors.yellow}${JSON.stringify(req.body)}${colors.reset}`
      : '';

    this.logger.log(
      `${colors.blue}→${colors.reset} ${colors.yellow}${req.method} /${url}${colors.reset}${params}${body}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `${colors.blue}←${colors.reset} ${colors.yellow}${req.method} /${url}${colors.reset} | ${colors.yellow}${res.statusCode}${colors.reset}  | ${colors.green}${duration}ms${colors.reset}`,
        );
      }),
    );
  }
}
