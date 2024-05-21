import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/abilities.factory';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

const TOKEN_NOT_FOUND_MESSAGE = 'Token not found';
const TOKEN_EXPIRED_MESSAGE = 'Token expired';
const INVALID_TOKEN_MESSAGE = 'Invalid token';
const NO_PERMISSION_MESSAGE = 'You do not have permission to perform this action';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean | never> {
    const subject = this.reflector.get<string>('Subject', context.getHandler());
    const action = this.reflector.get<string>('Action', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(TOKEN_NOT_FOUND_MESSAGE);
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(TOKEN_EXPIRED_MESSAGE);
      } else {
        throw new UnauthorizedException(INVALID_TOKEN_MESSAGE);
      }
    }

    const permissions = payload.role.flatMap((role) =>
      role.permissionID.map(Number),
    );
    if (!permissions) {
      throw new ForbiddenException(NO_PERMISSION_MESSAGE);
    }
    const ability = this.abilityFactory.createForUser(permissions);
    const checkAbility = ability.can(action[0], subject[0]);
    if (!checkAbility) {
      throw new ForbiddenException(NO_PERMISSION_MESSAGE);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}