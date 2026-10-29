import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/** Back-office only: requires an admin token. */
@Injectable()
export class GqlAdminAuthGuard extends AuthGuard('admin-jwt') {
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
