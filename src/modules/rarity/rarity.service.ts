import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { RarityEntity } from './rarity.entity';
import { CreateRarityInput, UpdateRarityInput } from './dto/rarity.inputs';

@Injectable()
export class RarityService {
  constructor(private readonly em: EntityManager) {}

  findAll() {
    return this.em.find(RarityEntity, {}, { orderBy: { sortOrder: 'asc' } });
  }

  findOne(id: number) {
    return this.em.findOneOrFail(RarityEntity, id);
  }

  async create(input: CreateRarityInput) {
    const rarity = this.em.create(RarityEntity, input);
    await this.em.flush();
    return rarity;
  }

  async update(id: number, input: UpdateRarityInput) {
    const rarity = await this.findOne(id);
    this.em.assign(rarity, input);
    await this.em.flush();
    return rarity;
  }

  async remove(id: number) {
    await this.em.nativeDelete(RarityEntity, id);
    return true;
  }
}
