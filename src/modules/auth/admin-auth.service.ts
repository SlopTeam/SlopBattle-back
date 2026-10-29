import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/entities/admin.entity';
import { ADMIN_JWT_AUDIENCE, ADMIN_JWT_EXPIRES_IN } from './auth.constants';
import { verifyPassword } from './password';

interface AdminJwtPayload {
  sub: number;
}

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly admins: AdminService,
    private readonly jwt: JwtService,
  ) {}

  async validate(email: string, password: string): Promise<Admin> {
    const admin = await this.admins.findByEmail(email);
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return admin;
  }

  async login(admin: Admin): Promise<{ access_token: string }> {
    const payload: AdminJwtPayload = { sub: admin.id };
    return {
      access_token: await this.jwt.signAsync(payload, {
        audience: ADMIN_JWT_AUDIENCE,
        expiresIn: ADMIN_JWT_EXPIRES_IN,
      }),
    };
  }
}
