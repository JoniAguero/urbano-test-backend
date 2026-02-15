import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import { UserRepositoryPort, UserRelation } from '../../domain/ports/user.repository.port';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    async create(data: Partial<User>, roles: Role[]): Promise<User> {
        const hashedPassword = await hash(data.password, 10);
        const user = this.repo.create({
            ...data,
            password: hashedPassword,
            roles,
        });
        return this.repo.save(user);
    }

    async findByEmail(email: string, relations?: UserRelation): Promise<User | null> {
        return this.repo.findOne({ where: { email }, relations });
    }

    async findById(id: number, relations?: UserRelation): Promise<User | null> {
        return this.repo.findOne({ where: { id }, relations });
    }

    async save(user: User): Promise<User> {
        return this.repo.save(user);
    }
}
