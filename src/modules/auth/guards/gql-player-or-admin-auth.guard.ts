import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/** Shared reads (cards, categories, types): accepts a player token or an admin token. */
@Injectable()
export class GqlPlayerOrAdminAuthGuard extends AuthGuard(['jwt', 'admin-jwt']) {
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
