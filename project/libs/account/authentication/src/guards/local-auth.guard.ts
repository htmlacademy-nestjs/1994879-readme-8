import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../constant';

export class LocalAuthGuard extends AuthGuard(StrategyName.Local) {}
