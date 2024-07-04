import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { RankService } from 'src/rank/rank.service';
  import { AuthGuard } from './auth.gaurd';
  
  @Injectable()
  export class RankGuard extends AuthGuard implements CanActivate {
    constructor(
      jwtService: JwtService,
      private readonly rankService: RankService
    ) {
      super(jwtService);
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const canActivate = await super.canActivate(context);
      if (!canActivate) {
        return false;
      }
  
      const request = context.switchToHttp().getRequest();
      const { role, isBlock, rankID } = request.user;

      if (role !== 'member' || isBlock) {
        throw new UnauthorizedException('Access denied: Invalid role or user is blocked.');
      }

      try {
        const rank = await this.rankService.getRankDetailService(rankID);
        if (rank.rankName !== 'Gold') {
          throw new UnauthorizedException('Access restricted: Gold membership required.');
        }
      } catch (error) {
        throw new UnauthorizedException('Access denied: Unable to verify user rank.');
      }
  
      return true;
    }
  }
  