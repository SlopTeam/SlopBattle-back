import { Module } from "@nestjs/common";
import { UserCardsService } from "./user-cards.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserCardsEntity } from "./entities/user-cards.entity";
import { UserCardsResolver } from "./resolvers/user-cards.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([UserCardsEntity])],
    providers: [UserCardsService, UserCardsResolver],
    exports: [UserCardsService],
})
export class UserCardsModule {}