import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly repo: EntityRepository<Admin>,
    private readonly entityManager: EntityManager,
  ) {}

  findByEmail(email: string): Promise<Admin | null> {
    return this.repo.findOne({ email: email.trim().toLowerCase() });
  }

  findById(id: number): Promise<Admin | null> {
    return this.repo.findOne({ id });
  }

  async create(email: string, passwordHash: string): Promise<Admin> {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.findByEmail(normalizedEmail)) {
      throw new ConflictException('Cet admin existe déjà');
    }
    const admin = this.repo.create({ email: normalizedEmail, passwordHash });
    await this.entityManager.flush();
    return admin;
  }
}
