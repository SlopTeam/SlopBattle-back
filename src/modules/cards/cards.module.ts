import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './card.entity';
import { CardResolver } from './card.resolver';
import { CardsService } from './cards.service';

@Module({
  imports: [MikroOrmModule.forFeature([Card])],
  providers: [CardResolver, CardsService],
})
export class CardsModule {}
