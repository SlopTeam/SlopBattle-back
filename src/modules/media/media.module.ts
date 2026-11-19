import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Media } from './media.entity';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';

@Module({
  imports: [MikroOrmModule.forFeature([Media])],
  providers: [MediaResolver, MediaService],
})
export class MediaModule {}
