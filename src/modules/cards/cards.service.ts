import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import type { FilterQuery, FindOptions } from '@mikro-orm/core';
import { Card } from './card.entity';
import { CardSort, CardsPage } from './models/cards-page.model';
import {
  CardsFilterInput,
  CreateCardInput,
  UpdateCardInput,
} from './dto/card.inputs';

const populate = ['categories', 'types', 'rarity'] as const;

export const MAX_PAGE_SIZE = 100;

// id last: rows with the same sort value keep a stable order across pages
const orderBy: Record<CardSort, FindOptions<Card>['orderBy']> = {
  [CardSort.TITLE_ASC]: [{ title: 'asc' }, { id: 'asc' }],
  [CardSort.TITLE_DESC]: [{ title: 'desc' }, { id: 'asc' }],
  [CardSort.RARITY_DESC]: [
    { rarity: 'desc' },
    { title: 'asc' },
    { id: 'asc' },
  ],
  [CardSort.NEWEST]: [{ createdAt: 'desc' }, { id: 'asc' }],
};

// LIKE wildcards typed by the user are matched literally
function escapeLike(text: string) {
  return text.replace(/[\\%_]/g, '\\$&');
}

@Injectable()
export class CardsService {
  constructor(private readonly em: EntityManager) {}

  findAll(filter?: CardsFilterInput) {
    return this.em.find(Card, this.toWhere(filter), { populate });
  }

  async findPage(
    filter: CardsFilterInput | undefined,
    page: number,
    pageSize: number,
    sort: CardSort,
  ): Promise<CardsPage> {
    const size = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
    const current = Math.max(page, 1);
    const [items, total] = await this.em.findAndCount(
      Card,
      this.toWhere(filter),
      {
        populate,
        orderBy: orderBy[sort],
        limit: size,
        offset: (current - 1) * size,
      },
    );
    return {
      items,
      total,
      page: current,
      pageSize: size,
      pageCount: Math.max(1, Math.ceil(total / size)),
    };
  }

  // values inside one filter are OR-ed, different filters are AND-ed
  private toWhere(filter?: CardsFilterInput): FilterQuery<Card> {
    const where: FilterQuery<Card> = {};
    const search = filter?.search?.trim();
    if (search) {
      where.title = { $ilike: `%${escapeLike(search)}%` };
    }
    if (filter?.rarityId != null) {
      where.rarity = filter.rarityId;
    }
    if (filter?.categoryIds?.length) {
      where.categories = { id: { $in: filter.categoryIds } };
    }
    if (filter?.typeIds?.length) {
      where.types = { id: { $in: filter.typeIds } };
    }
    return where;
  }

  findOne(id: number) {
    return this.em.findOneOrFail(Card, id, { populate });
  }

  async create(input: CreateCardInput) {
    const { categoryIds, typeIds, rarityId, ...data } = input;
    const card = this.em.create(Card, {
      ...data,
      rarity: rarityId,
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
    const { categoryIds, typeIds, rarityId, ...data } = input;
    this.em.assign(card, {
      ...data,
      ...(rarityId != null && { rarity: rarityId }),
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
