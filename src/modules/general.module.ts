import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    CardsModule,
    UserModule,
  ],
})
export class GeneralModule {}
