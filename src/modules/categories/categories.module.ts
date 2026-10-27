import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './category.entity';
import { CategoryResolver } from './category.resolver';
import { CategoriesService } from './categories.service';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  providers: [CategoryResolver, CategoriesService],
})
export class CategoriesModule {}
