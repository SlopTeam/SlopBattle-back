import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BoosterEntity } from './entities/booster.entity';
import { BoosterCardsEntity } from './entities/booster-cards.entity';
import { BoosterRarityEntity } from './entities/booster-rarity.entity';
import { Card } from '../cards/card.entity';
import { RarityEntity } from '../rarity/rarity.entity';
import { CreateBoosterInput, UpdateBoosterInput } from './dto/booster.inputs';
import {
  AddCardToBoosterInput,
  UpdateBoosterCardInput,
} from './dto/booster-cards.inputs';
import {
  AddRarityToBoosterInput,
  UpdateBoosterRarityInput,
} from './dto/booster-rarity.inputs';

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
    await this.em.nativeDelete(BoosterRarityEntity, { booster: id });
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

  findRarities(boosterId: number) {
    return this.em.find(
      BoosterRarityEntity,
      { booster: boosterId },
      { populate: ['rarity'] },
    );
  }

  async addRarity(input: AddRarityToBoosterInput) {
    const { boosterId, rarityId, ...rest } = input;
    await this.findOne(boosterId);
    await this.em.findOneOrFail(RarityEntity, rarityId);
    const existing = await this.em.findOne(BoosterRarityEntity, {
      booster: boosterId,
      rarity: rarityId,
    });
    if (existing) {
      throw new ConflictException('This rarity is already in the booster');
    }
    const boosterRarity = this.em.create(BoosterRarityEntity, {
      booster: boosterId,
      rarity: rarityId,
      ...rest,
    });
    await this.em.flush();
    await this.em.populate(boosterRarity, ['rarity']);
    return boosterRarity;
  }

  async updateRarity(id: number, input: UpdateBoosterRarityInput) {
    const boosterRarity = await this.em.findOneOrFail(
      BoosterRarityEntity,
      id,
      { populate: ['rarity'] },
    );
    this.em.assign(boosterRarity, input);
    await this.em.flush();
    return boosterRarity;
  }

  async removeRarity(id: number) {
    await this.em.nativeDelete(BoosterRarityEntity, id);
    return true;
  }
}
