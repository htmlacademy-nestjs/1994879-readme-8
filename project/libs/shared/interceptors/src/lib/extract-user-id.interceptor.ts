import { AppHeader } from '@project/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ExtractUserIdInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    request.user.sub = request.headers[AppHeader.UserId];

    return next.handle();
  }
}
