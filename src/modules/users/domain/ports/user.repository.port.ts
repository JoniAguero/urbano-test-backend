import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';

export type UserRelation = {
    roles: boolean;
};

export interface UserRepositoryPort {
    create(data: Partial<User>, roles: Role[]): Promise<User>;
    findByEmail(email: string, relations?: UserRelation): Promise<User | null>;
    findById(id: number, relations?: UserRelation): Promise<User | null>;
    save(user: User): Promise<User>;
}
