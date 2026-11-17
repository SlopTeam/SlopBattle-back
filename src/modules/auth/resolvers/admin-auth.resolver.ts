import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminModel } from '../../admin/models/admin.model';
import { AdminAuthService } from '../admin-auth.service';
import { Admin } from '../decorators/admin.decorator';
import { CurrentAdmin } from '../decorators/current-admin.decorator';
import { LoginInput } from '../inputs/auth.inputs';
import type { AuthenticatedAdmin } from '../interfaces/authenticated-admin.interface';
import { AuthPayload } from '../models/auth.model';

@Resolver()
export class AdminAuthResolver {
  constructor(private readonly adminAuth: AdminAuthService) {}

  @Mutation(() => AuthPayload)
  async adminLogin(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const admin = await this.adminAuth.validate(input.email, input.password);
    return this.adminAuth.login(admin);
  }

  @Admin()
  @Query(() => AdminModel)
  adminMe(@CurrentAdmin() admin: AuthenticatedAdmin): AdminModel {
    return { id: admin.id, email: admin.email };
  }
}
