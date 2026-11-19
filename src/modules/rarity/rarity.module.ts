import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RarityEntity } from './rarity.entity';
import { RarityResolver } from './rarity.resolver';
import { RarityService } from './rarity.service';

@Module({
  imports: [MikroOrmModule.forFeature([RarityEntity])],
  providers: [RarityResolver, RarityService],
})
export class RarityModule {}
