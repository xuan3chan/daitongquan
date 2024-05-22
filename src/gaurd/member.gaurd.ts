import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from './auth.gaurd';

@Injectable()
export class MemberGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivate = await super.canActivate(context);
      if (!canActivate) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Token not found or invalid');
    }

    const request = context.switchToHttp().getRequest();
    if (request.user && request.user.role === 'member' && request.user.isBlock === false) {
      return true;
    }
    throw new UnauthorizedException('Only members are allowed OR you are blocked');
  }
}