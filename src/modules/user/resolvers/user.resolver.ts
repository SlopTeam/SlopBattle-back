import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt-auth.guard';
import { UpdateUserProfileInput } from '../inputs/update-user-profile.input';
import { PublicUserModel, UserProfileModel } from '../models/user.model';
import { toProfile, toPublic } from '../user.mapper';
import { UserService } from '../user.service';

interface AuthenticatedUser {
  id: number;
}

@Resolver(() => UserProfileModel)
export class UserResolver {
  constructor(private readonly users: UserService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => UserProfileModel)
  async myProfile(
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserProfileModel> {
    const user = await this.users.getById(currentUser.id);
    return toProfile(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserProfileModel)
  async updateMyProfile(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UserProfileModel> {
    const user = await this.users.updateProfile(currentUser.id, input);
    return toProfile(user);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [PublicUserModel], { name: 'users' })
  async listUsers(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<PublicUserModel[]> {
    const users = await this.users.findAll(limit, offset);
    return users.map(toPublic);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => PublicUserModel, { name: 'user' })
  async getUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PublicUserModel> {
    return toPublic(await this.users.getById(id));
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteMyAccount(
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<boolean> {
    await this.users.delete(currentUser.id);
    return true;
  }
}
