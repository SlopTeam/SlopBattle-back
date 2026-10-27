import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Card } from './card.entity';
import { CreateCardInput, UpdateCardInput } from './dto/card.inputs';

const populate = ['categories', 'types'] as const;

@Injectable()
export class CardsService {
  constructor(private readonly em: EntityManager) {}

  findAll() {
    return this.em.find(Card, {}, { populate });
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
