import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { CategoryEntity } from './category.entity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './dto/category.inputs';

@Injectable()
export class CategoriesService {
  constructor(private readonly em: EntityManager) {}

  findAll() {
    return this.em.find(CategoryEntity, {});
  }

  findOne(id: number) {
    return this.em.findOneOrFail(CategoryEntity, id);
  }

  async create(input: CreateCategoryInput) {
    const category = this.em.create(CategoryEntity, input);
    await this.em.flush();
    return category;
  }

  async update(id: number, input: UpdateCategoryInput) {
    const category = await this.findOne(id);
    this.em.assign(category, input);
    await this.em.flush();
    return category;
  }

  async remove(id: number) {
    await this.em.nativeDelete(CategoryEntity, id);
    return true;
  }
}
