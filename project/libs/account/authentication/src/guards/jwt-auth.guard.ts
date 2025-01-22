import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { StrategyName } from '../constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyName.Jwt) {}
