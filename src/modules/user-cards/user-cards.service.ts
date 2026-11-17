import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, EntityManager, FilterQuery } from "@mikro-orm/core";
import { UserCardsEntity } from "./entities/user-cards.entity";
import { CardCollection } from "./models/card-collection.model";
import { CardsFilterInput } from "../cards/dto/card.inputs";
import { Card } from "../cards/card.entity";

@Injectable()
export class UserCardsService {
    constructor(
        @InjectRepository(UserCardsEntity) private readonly repo: EntityRepository<UserCardsEntity>,
        private readonly entityManager: EntityManager,
    ) {}

    async findCollectionByUserId(userId: number, filter?: CardsFilterInput): Promise<CardCollection> {
        const where: FilterQuery<Card> = {};
        if (filter?.rarityId != null) {
            where.rarityId = filter.rarityId;
        }
        if (filter?.categoryIds?.length) {
            where.categories = { id: { $in: filter.categoryIds } };
        }
        if (filter?.typeIds?.length) {
            where.types = { id: { $in: filter.typeIds } };
        }
        const hasFilter = Object.keys(where).length > 0;
        const userCards = await this.repo.find({ user: userId, ...(hasFilter ? { card: where } : {}) });
        const collection = {
            userId: userId,
            cards: userCards.map(uc => ({
                cardId: uc.card.id,
                quantity: uc.quantity,
                firstObtainedAt: uc.firstObtainedAt,
            })),
        };
        return collection;
    }

    async addCards(userId: number, cardIds: number[]): Promise<UserCardsEntity[]> {
        const results: UserCardsEntity[] = [];
        for (const cardId of cardIds) {
            const alreadyExists = await this.repo.findOne({ user: userId, card: cardId });
            if (alreadyExists) {
                const newQuantity = alreadyExists.quantity + 1;
                this.repo.assign(alreadyExists, { quantity: newQuantity });
                await this.entityManager.flush();
                results.push(alreadyExists);
                continue;
            }
            const entity = this.repo.create({ user: userId, card: cardId, quantity: 1, firstObtainedAt: new Date() });
            await this.entityManager.flush();
            results.push(entity);
        }
        return results;
    }

    async removeCards(userId: number, cardIds: number[]): Promise<UserCardsEntity[]> {
        const results: UserCardsEntity[] = [];
        for (const cardId of cardIds) {
            const existing = await this.repo.findOne({ user: userId, card: cardId });
            if (!existing) {
                continue;
            }
            if (existing.quantity > 1) {
                this.repo.assign(existing, { quantity: existing.quantity - 1 });
                await this.entityManager.flush();
                results.push(existing);
            } else {
                this.entityManager.remove(existing);
                await this.entityManager.flush();
            }
        }
        return results;
    }
}
