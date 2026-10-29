import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CardTypeEntity } from './type.entity';
import { CardTypeResolver } from './type.resolver';
import { TypesService } from './types.service';

@Module({
  imports: [MikroOrmModule.forFeature([CardTypeEntity])],
  providers: [CardTypeResolver, TypesService],
})
export class TypesModule {}
