import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../../admin/admin.service';
import { ADMIN_JWT_AUDIENCE, JWT_ISSUER } from '../auth.constants';
import type { AuthenticatedAdmin } from '../interfaces/authenticated-admin.interface';

interface AdminJwtPayload {
  sub: number;
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    config: ConfigService,
    private readonly admins: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
    });
  }

  async validate(payload: AdminJwtPayload): Promise<AuthenticatedAdmin> {
    if (!Number.isInteger(payload.sub)) {
      throw new UnauthorizedException('Jeton invalide');
    }

    const admin = await this.admins.findById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException('Jeton invalide');
    }
    return { id: admin.id, email: admin.email, isAdmin: true };
  }
}
