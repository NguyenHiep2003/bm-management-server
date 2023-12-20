import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/attribute/role';

@Injectable()
export class RoleAuthGuard extends AuthGuard('role') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rolesRequire: Role[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequire) return true;
    const userRole = context.switchToHttp().getRequest().user?.role;
    if (!rolesRequire.includes(userRole)) return false;
    return true;
  }
}
