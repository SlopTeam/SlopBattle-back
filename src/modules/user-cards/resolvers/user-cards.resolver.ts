import { Resolver, Query, Args, ID, Mutation } from "@nestjs/graphql";
import { UpdateUserCardsInput } from "../inputs/update-user-cards.input";
import { UserCardsEntity } from "../entities/user-cards.entity";
import { UserCardsService } from "../user-cards.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "../../auth/guards/gql-jwt-auth.guard";
import { CardCollection } from "../models/card-collection.model";
import type { AuthenticatedUser } from "../../user/interface/authenticated-user.interface";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

@Resolver(() => UserCardsEntity)
export class UserCardsResolver {
    constructor(private readonly userCardsService: UserCardsService) {}

    @UseGuards(GqlJwtAuthGuard)
    @Query(() => CardCollection)
    async myCardCollection(
        @CurrentUser() currentUser: AuthenticatedUser,
    ): Promise<CardCollection> {
        return this.userCardsService.findCollectionByUserId(currentUser.id);
    }

    @UseGuards(GqlJwtAuthGuard)
    @Mutation(() => [UserCardsEntity])
    async addCardsInCollection(
        @CurrentUser() currentUser: AuthenticatedUser,
        @Args('input') input: UpdateUserCardsInput,
    ): Promise<UserCardsEntity[]> {
        return this.userCardsService.addCards(currentUser.id, input.cardIds);
    }
    
    @UseGuards(GqlJwtAuthGuard)
    @Mutation(() => [UserCardsEntity])
    async removeCardsFromCollection(
        @CurrentUser() currentUser: AuthenticatedUser,
        @Args('input') input: UpdateUserCardsInput,
    ): Promise<UserCardsEntity[]> {
        return this.userCardsService.removeCards(currentUser.id, input.cardIds);
    }
}
