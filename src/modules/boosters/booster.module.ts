import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BoosterEntity } from './entities/booster.entity';
import { BoosterCardsEntity } from './entities/booster-cards.entity';
import { BoosterRarityEntity } from './entities/booster-rarity.entity';
import { BoosterResolver } from './booster.resolver';
import { BoosterService } from './booster.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      BoosterEntity,
      BoosterCardsEntity,
      BoosterRarityEntity,
    ]),
  ],
  providers: [BoosterResolver, BoosterService],
})
export class BoosterModule {}
