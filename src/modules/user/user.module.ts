import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "./entities/user.entity";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}