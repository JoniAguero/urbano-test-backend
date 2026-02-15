import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/database/entities/role.entity';
import { RoleRepositoryPort } from '../../domain/ports/role.repository.port';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepositoryPort {
    constructor(
        @InjectRepository(Role)
        private readonly repo: Repository<Role>,
    ) { }

    async findById(roleId: number): Promise<Role | null> {
        return this.repo.findOne({ where: { id: roleId } });
    }
}
