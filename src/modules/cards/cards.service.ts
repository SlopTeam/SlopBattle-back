import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import type { FilterQuery } from '@mikro-orm/core';
import { Card } from './card.entity';
import {
  CardsFilterInput,
  CreateCardInput,
  UpdateCardInput,
} from './dto/card.inputs';

const populate = ['categories', 'types'] as const;

@Injectable()
export class CardsService {
  constructor(private readonly em: EntityManager) {}

  // values inside one filter are OR-ed, different filters are AND-ed
  findAll(filter?: CardsFilterInput) {
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
    return this.em.find(Card, where, { populate });
  }

  findOne(id: number) {
    return this.em.findOneOrFail(Card, id, { populate });
  }

  async create(input: CreateCardInput) {
    const { categoryIds, typeIds, ...data } = input;
    const card = this.em.create(Card, {
      ...data,
      categories: categoryIds ?? [],
      types: typeIds ?? [],
    });
    await this.em.flush();
    // assigned ids are bare references; load them so name resolves
    await this.em.populate(card, populate, { refresh: true });
    return card;
  }

  async update(id: number, input: UpdateCardInput) {
    const card = await this.findOne(id);
    const { categoryIds, typeIds, ...data } = input;
    this.em.assign(card, {
      ...data,
      ...(categoryIds && { categories: categoryIds }),
      ...(typeIds && { types: typeIds }),
    });
    await this.em.flush();
    // assigned ids are bare references; load them so name resolves
    await this.em.populate(card, populate, { refresh: true });
    return card;
  }

  async remove(id: number) {
    await this.em.nativeDelete(Card, id);
    return true;
  }
}
