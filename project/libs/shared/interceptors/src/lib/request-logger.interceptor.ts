// src/interceptors/request-logger.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { AppHeader } from '@project/core';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers[AppHeader.RequestId] || 'none';

    this.logger.log(`[${request.method} ${request.url}] ${AppHeader.RequestId}: ${requestId}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Request Completed - ${AppHeader.RequestId}: ${requestId}`);
      })
    );
  }
}
