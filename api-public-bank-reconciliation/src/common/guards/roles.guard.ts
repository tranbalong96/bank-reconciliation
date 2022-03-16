import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    ) { }

  async canActivate(context: ExecutionContext) {
    const roleController = this.reflector.get<string[]>('roles', context.getClass());
    if (!roleController) {
      return true;
    }
    // get access token
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const tokenSplit = authorization.split(' ');
    if (tokenSplit.length !== 2) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    
    const verify = await this.authService.authorize(authorization);
    return !!verify;
  }
}
