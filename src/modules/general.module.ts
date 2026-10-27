import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { CategoriesModule } from './categories/categories.module';
import { TypesModule } from './types/types.module';

@Module({
  imports: [CardsModule, CategoriesModule, TypesModule],
})
export class GeneralModule {}
