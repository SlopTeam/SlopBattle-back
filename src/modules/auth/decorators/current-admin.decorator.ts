import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthenticatedAdmin } from '../interfaces/authenticated-admin.interface';

/** Admin attached to the request by the admin-jwt strategy. Use with @Admin(). */
export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin =>
    GqlExecutionContext.create(ctx).getContext().req.user,
);
