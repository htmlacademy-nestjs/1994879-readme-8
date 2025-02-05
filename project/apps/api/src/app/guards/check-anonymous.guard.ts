import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppHeader } from '@project/core';

@Injectable()
export class CheckAnonymousGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers[AppHeader.Auth]) {
      throw new BadRequestException('You are already registered.');
    }
    return true;
  }
}
