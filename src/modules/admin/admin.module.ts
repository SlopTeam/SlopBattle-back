import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Admin])],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
