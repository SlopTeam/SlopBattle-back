import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlAdminAuthGuard } from '../guards/gql-admin-auth.guard';
import { GqlPlayerOrAdminAuthGuard } from '../guards/gql-player-or-admin-auth.guard';
import { GqlJwtAuthGuard } from '../guards/gql-jwt-auth.guard';

/** Restricts a resolver (or a whole resolver class) to back-office admins. */
export const Admin = () => applyDecorators(UseGuards(GqlAdminAuthGuard));

/** Open to any signed-in account, player or admin. */
export const PlayerOrAdmin = () =>
  applyDecorators(UseGuards(GqlPlayerOrAdminAuthGuard));

export const Player = () =>
  applyDecorators(UseGuards(GqlJwtAuthGuard));