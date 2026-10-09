import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

interface GoogleProfile {
  id: string;
  emails?: Array<{ value: string; verified?: boolean }>;
}

interface JwtPayload {
  sub: number;
  email: string;
}

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key);
      }
    });
  });
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

    const passwordHash = await this.hashPassword(password);
    return this.users.create({ email: normalizedEmail, passwordHash });
  }

  async validateLocal(email: string, password: string): Promise<User> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (!user?.passwordHash || !(await this.verifyPassword(password, user.passwordHash))) {
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
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return { access_token: await this.jwt.signAsync(payload) };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = await deriveKey(password, salt);
    return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
  }

  private async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [algorithm, saltHex, hashHex] = storedHash.split('$');
    if (
      algorithm !== 'scrypt' ||
      !saltHex ||
      !hashHex ||
      !/^[\da-f]+$/i.test(saltHex) ||
      !/^[\da-f]+$/i.test(hashHex)
    ) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const expectedHash = Buffer.from(hashHex, 'hex');
    if (salt.length !== 16 || expectedHash.length !== 64) return false;

    const actualHash = await deriveKey(password, salt);
    return timingSafeEqual(actualHash, expectedHash);
  }
}
