import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './card.entity';
import { Category } from '../categories/category.entity';
import { CardType } from '../types/type.entity';
import { CardResolver } from './card.resolver';
import { CardsService } from './cards.service';

@Module({
  imports: [MikroOrmModule.forFeature([Card, Category, CardType])],
  providers: [CardResolver, CardsService],
})
export class CardsModule {}
