import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { hashPassword, verifyPassword } from './password';

interface GoogleProfile {
  id: string;
  emails?: Array<{ value: string; verified?: boolean }>;
}

interface JwtPayload {
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.users.findByEmail(normalizedEmail)) {
      throw new ConflictException('Cette adresse e-mail est déjà utilisée');
    }

    const passwordHash = await hashPassword(password);
    return this.users.create({ email: normalizedEmail, passwordHash });
  }

  async validateLocal(email: string, password: string): Promise<User> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (
      !user?.passwordHash ||
      !(await verifyPassword(password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return user;
  }

  async validateGoogle(profile: GoogleProfile): Promise<User> {
    const googleId = profile.id;
    const email = profile.emails?.find((entry) => entry.verified)?.value;
    if (!googleId || !email) {
      throw new UnauthorizedException(
        'Google doit fournir une adresse e-mail vérifiée',
      );
    }

    const existingGoogleUser = await this.users.findByGoogleId(googleId);
    if (existingGoogleUser) return existingGoogleUser;

    const normalizedEmail = email.trim().toLowerCase();
    const existingEmailUser = await this.users.findByEmail(normalizedEmail);
    if (existingEmailUser) {
      if (existingEmailUser.googleId) {
        throw new ConflictException(
          'Cette adresse e-mail est déjà liée à un autre compte Google',
        );
      }
      return this.users.update(existingEmailUser.id, { googleId });
    }

    return this.users.create({ email: normalizedEmail, googleId });
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload: JwtPayload = { sub: user.id };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}
