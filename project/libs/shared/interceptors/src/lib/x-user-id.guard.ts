import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AppHeader } from '@project/core';
import { Observable } from 'rxjs';

@Injectable()
export class XUserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers[AppHeader.UserId];

    if (!userId) {
      throw new UnauthorizedException(`${AppHeader.UserId} header is missing`);
    }

    return true;
  }
}
