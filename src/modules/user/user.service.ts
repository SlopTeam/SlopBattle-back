import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { User } from "./entities/user.entity";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: EntityRepository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ email });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.repo.findOne({ googleId });
  }

  findById(id: number): Promise<User | null> {
    return this.repo.findOne({ id });
  }

  async findAll(limit = 20, offset = 0): Promise<User[]> {
    return this.repo.find(
      {},
      {
        orderBy: { id: "asc" },
        limit: Math.min(Math.max(limit, 1), 100),
        offset: Math.max(offset, 0),
      },
    );
  }

  async getById(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    return user;
  }

  async create(data: {
    email: string;
    passwordHash?: string;
    googleId?: string;
  }): Promise<User> {
    if (!data.passwordHash && !data.googleId) {
      throw new BadRequestException(
        "Un mot de passe ou un compte Google est requis",
      );
    }
    const user = this.repo.create({
      email: data.email,
      passwordHash: data.passwordHash ?? null,
      googleId: data.googleId ?? null,
      coins: 0,
      createdAt: new Date(),
    });
    await this.entityManager.flush();
    return user;
  }

  async update(
    id: number,
    data: Partial<Pick<User, "googleId" | "passwordHash">>,
  ): Promise<User> {
    const user = await this.repo.findOneOrFail({ id });
    this.repo.assign(user, data);
    await this.entityManager.flush();
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    this.entityManager.remove(user);
    await this.entityManager.flush();
  }

  async updateProfile(
    id: number,
    data: Partial<Pick<User, "username" | "avatarUrl">>,
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    if (data.username) {
      const existingUser = await this.repo.findOne({
        username: data.username,
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Ce nom d'utilisateur est déjà utilisé");
      }
    }

    this.repo.assign(user, data);
    await this.entityManager.flush();
    return user;
  }
}