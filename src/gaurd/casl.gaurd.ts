import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/abilities.factory';
import { User } from '../users/schema/user.schema';
import { Admin } from '../admin/schema/admin.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean | never {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
        return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1]; // Assuming the token is in the Authorization header
    const decodedToken = jwt.decode(token) as jwt.JwtPayload; // Typecast decodedToken as JwtPayload

    const user: User | Admin = {
        role: decodedToken.role as string, // Access role property from decodedToken and typecast as string
    } as User | Admin; // Explicitly cast the user object

    const ability = this.abilityFactory.createForUser(user);

    const hasRole = roles.some(role => ability.can(role, 'all'));

    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}