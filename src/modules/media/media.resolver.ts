import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Admin } from '../auth/decorators/admin.decorator';
import { UploadMediaInput } from './dto/media.inputs';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { mediaUrl } from './media.storage';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Admin()
  @Mutation(() => Media, {
    description:
      'Stores an image (PNG, JPEG or WebP, 2 MB max); pass its id as mediaId to createCard/updateCard',
  })
  uploadMedia(@Args('input') input: UploadMediaInput) {
    return this.mediaService.upload(input);
  }

  @ResolveField(() => String)
  url(@Parent() media: Media) {
    return mediaUrl(media.key);
  }
}
