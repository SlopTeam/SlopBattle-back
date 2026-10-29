import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field() access_token: string;
}

@ObjectType()
export class CurrentUserModel {
  @Field(() => Int) id: number;
  @Field() email: string;
}
