import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BoosterEntity } from './entities/booster.entity';
import { BoosterCardsEntity } from './entities/booster-cards.entity';
import { Card } from '../cards/card.entity';
import { CreateBoosterInput, UpdateBoosterInput } from './dto/booster.inputs';
import {
  AddCardToBoosterInput,
  UpdateBoosterCardInput,
} from './dto/booster-cards.inputs';

@Injectable()
export class BoosterService {
  constructor(private readonly em: EntityManager) {}

  findAll() {
    return this.em.find(BoosterEntity, {});
  }

  findOne(id: number) {
    return this.em.findOneOrFail(BoosterEntity, id);
  }

  async create(input: CreateBoosterInput) {
    const booster = this.em.create(BoosterEntity, input);
    await this.em.flush();
    return booster;
  }

  async update(id: number, input: UpdateBoosterInput) {
    const booster = await this.findOne(id);
    this.em.assign(booster, input);
    await this.em.flush();
    return booster;
  }

  async remove(id: number) {
    await this.em.nativeDelete(BoosterCardsEntity, { booster: id });
    await this.em.nativeDelete(BoosterEntity, id);
    return true;
  }

  findCards(boosterId: number) {
    return this.em.find(
      BoosterCardsEntity,
      { booster: boosterId },
      { populate: ['card'] },
    );
  }

  async addCard(input: AddCardToBoosterInput) {
    const { boosterId, cardId, ...rest } = input;
    await this.findOne(boosterId);
    await this.em.findOneOrFail(Card, cardId);
    const existing = await this.em.findOne(BoosterCardsEntity, {
      booster: boosterId,
      card: cardId,
    });
    if (existing) {
      throw new ConflictException('This card is already in the booster');
    }
    const boosterCard = this.em.create(BoosterCardsEntity, {
      booster: boosterId,
      card: cardId,
      ...rest,
    });
    await this.em.flush();
    await this.em.populate(boosterCard, ['card']);
    return boosterCard;
  }

  async updateCard(id: number, input: UpdateBoosterCardInput) {
    const boosterCard = await this.em.findOneOrFail(
      BoosterCardsEntity,
      id,
      { populate: ['card'] },
    );
    this.em.assign(boosterCard, input);
    await this.em.flush();
    return boosterCard;
  }

  async removeCard(id: number) {
    await this.em.nativeDelete(BoosterCardsEntity, id);
    return true;
  }
}
