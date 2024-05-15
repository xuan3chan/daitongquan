import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from './auth.gaurd';

@Injectable()
export class RoleGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    if (request.user && request.user.role === 'admin') {
      return true;
    }
    throw new UnauthorizedException('Only admins are allowed');
  }
}
