import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PublicUserModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  username!: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl!: string | null;

  @Field(() => Int)
  coins!: number;

  @Field(() => Date)
  createdAt!: Date;
}

@ObjectType()
export class UserProfileModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  username!: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl!: string | null;

  @Field(() => Int)
  coins!: number;

  @Field(() => Date)
  createdAt!: Date;
}
