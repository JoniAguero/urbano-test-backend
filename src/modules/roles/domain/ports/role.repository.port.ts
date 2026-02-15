import { Role } from 'src/database/entities/role.entity';

export interface RoleRepositoryPort {
    findById(roleId: number): Promise<Role | null>;
}
