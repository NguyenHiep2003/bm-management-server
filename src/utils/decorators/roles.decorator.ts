import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/attribute/role';

export const ROLES_KEY = 'Roles';
export const RolesDecor = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);
