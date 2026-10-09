import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Card } from './card.entity';
import { CreateCardInput, UpdateCardInput } from './dto/card.inputs';

@Injectable()
export class CardsService {
  constructor(private readonly em: EntityManager) {}

  findAll() {
    return this.em.find(Card, {});
  }

  findOne(id: number) {
    return this.em.findOneOrFail(Card, id);
  }

  async create(input: CreateCardInput) {
    const card = this.em.create(Card, input);
    await this.em.flush();
    return card;
  }

  async update(id: number, input: UpdateCardInput) {
    const card = await this.findOne(id);
    this.em.assign(card, input);
    await this.em.flush();
    return card;
  }

  async remove(id: number) {
    await this.em.nativeDelete(Card, id);
    return true;
  }
}
