import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { CardType } from './type.entity';
import { CreateCardTypeInput, UpdateCardTypeInput } from './dto/type.inputs';

@Injectable()
export class TypesService {
  constructor(private readonly em: EntityManager) {}

  findAll() {
    return this.em.find(CardType, {});
  }

  findOne(id: number) {
    return this.em.findOneOrFail(CardType, id);
  }

  async create(input: CreateCardTypeInput) {
    const cardType = this.em.create(CardType, input);
    await this.em.flush();
    return cardType;
  }

  async update(id: number, input: UpdateCardTypeInput) {
    const cardType = await this.findOne(id);
    this.em.assign(cardType, input);
    await this.em.flush();
    return cardType;
  }

  async remove(id: number) {
    await this.em.nativeDelete(CardType, id);
    return true;
  }
}
