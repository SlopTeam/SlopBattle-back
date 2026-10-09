import { Query, Resolver } from '@nestjs/graphql';

// GraphQL needs at least one Query to build a schema; replace with real resolvers.
@Resolver()
export class AppResolver {
  @Query(() => String)
  hello() {
    return 'hello';
  }
}
