import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CardsModule } from './modules/cards/cards.module';
import config from './mikro.config';
import { GeneralModule } from './modules/general.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, GeneralModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true, // in-memory code-first schema
        sortSchema: true,
        playground: configService.get('NODE_ENV') === 'dev', // enable playground in non-production environments
        include: [GeneralModule],
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }), // loads .env into process.env synchronously
    MikroOrmModule.forRoot(config),
    GeneralModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
