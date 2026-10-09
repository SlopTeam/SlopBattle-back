import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { User } from "./entities/user.entity";
import { Injectable } from "@nestjs/common";
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

  async create(data: {
    email: string;
    passwordHash?: string;
    googleId?: string;
  }): Promise<User> {
    const user = this.repo.create({
      email: data.email,
      passwordHash: data.passwordHash ?? null,
      googleId: data.googleId ?? null,
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
}