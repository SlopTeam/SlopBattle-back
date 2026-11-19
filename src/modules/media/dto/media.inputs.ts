import { Field, InputType } from '@nestjs/graphql';
import { IsBase64, IsIn, MaxLength } from 'class-validator';
import { MAX_MEDIA_SIZE, MEDIA_TYPES } from '../media.storage';

@InputType()
export class UploadMediaInput {
  @Field({
    description: 'File content, base64-encoded (2 MB max once decoded)',
  })
  @IsBase64()
  @MaxLength(Math.ceil(MAX_MEDIA_SIZE / 3) * 4)
  data!: string;

  @Field({ description: 'image/png, image/jpeg or image/webp' })
  @IsIn(MEDIA_TYPES)
  mimeType!: string;
}
