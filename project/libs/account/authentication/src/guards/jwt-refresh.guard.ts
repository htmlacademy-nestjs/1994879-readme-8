import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../constant';

export class JwtRefreshGuard extends AuthGuard(StrategyName.JwtRefresh) {}
