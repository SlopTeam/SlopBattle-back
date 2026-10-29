import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './card.entity';
import { CategoryEntity } from '../categories/category.entity';
import { CardTypeEntity } from '../types/type.entity';
import { CardResolver } from './card.resolver';
import { CardsService } from './cards.service';

@Module({
  imports: [MikroOrmModule.forFeature([Card, CategoryEntity, CardTypeEntity])],
  providers: [CardResolver, CardsService],
})
export class CardsModule {}
