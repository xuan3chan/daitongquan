import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/abilities.factory';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean | never> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
        return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('token not found');
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    request['user'] = payload;
    const permissions = payload.role.map(role => role.permissionID);
   console.log(permissions);

    const ability = this.abilityFactory.createForUser(permissions);

    const hasAbility = roles.some(role => ability.can(role, role));

    if (!hasAbility) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}