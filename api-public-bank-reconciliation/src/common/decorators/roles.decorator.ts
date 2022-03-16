import { SetMetadata } from '@nestjs/common';

// noinspection JSUnusedGlobalSymbols
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
