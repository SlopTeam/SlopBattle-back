import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';
import { AdminAuthService } from './admin-auth.service';
import { AuthController } from './auth.controller';
import { JWT_AUDIENCE, JWT_ISSUER } from './auth.constants';
import { AdminAuthResolver } from './resolvers/admin-auth.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AdminModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
          algorithm: 'HS256',
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthResolver,
    AdminAuthService,
    AdminAuthResolver,
    JwtStrategy,
    AdminJwtStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
