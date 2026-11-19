import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RegisterInput, LoginInput } from '../inputs/auth.inputs';
import { GqlJwtAuthGuard } from '../guards/gql-jwt-auth.guard';
import { AuthPayload, CurrentUserModel } from '../models/auth.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthPayload> {
    const user = await this.auth.register(input.email, input.password);
    return this.auth.login(user);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const user = await this.auth.validateLocal(input.email, input.password);
    return this.auth.login(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => CurrentUserModel)
  me(@CurrentUser() user: { id: number; email: string }): CurrentUserModel {
    return user;
  }
}
