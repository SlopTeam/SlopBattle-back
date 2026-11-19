import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "./entities/user.entity";
import { Module } from "@nestjs/common";
import { UserResolver } from "./resolvers/user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}