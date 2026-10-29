import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminModel {
  @Field(() => Int) id: number;
  @Field() email: string;
}
