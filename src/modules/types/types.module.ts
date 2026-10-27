import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CardType } from './type.entity';
import { CardTypeResolver } from './type.resolver';
import { TypesService } from './types.service';

@Module({
  imports: [MikroOrmModule.forFeature([CardType])],
  providers: [CardTypeResolver, TypesService],
})
export class TypesModule {}
