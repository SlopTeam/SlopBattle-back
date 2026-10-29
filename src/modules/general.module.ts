import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { CategoriesModule } from './categories/categories.module';
import { TypesModule } from './types/types.module';
import { UserModule } from './user/user.module';
import { UserCardsModule } from './user-cards/user-cards.module';

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    TypesModule,
    CardsModule,
    UserModule,
    UserCardsModule,

  ],
})
export class GeneralModule {}
