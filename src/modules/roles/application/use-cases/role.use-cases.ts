import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from 'src/modules/users/domain/ports/user.repository.port';
import { RoleRepositoryPort } from '../../domain/ports/role.repository.port';
import { USER_REPOSITORY, ROLE_REPOSITORY } from 'src/shared/tokens';
import { AssignRoleDto } from '../../infrastructure/dto/role.dto';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class AssignRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryPort,
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
    ) { }

    async execute(data: AssignRoleDto) {
        const role = await this.roleRepo.findById(data.roleId);
        if (!role) throw new NotFoundException(errorMessages.role.notFound);

        const user = await this.userRepo.findById(data.userId, { roles: true });
        if (!user) throw new NotFoundException(errorMessages.user.notFound);

        if (!user.roles.some((r) => r.id === data.roleId)) {
            user.roles.push(role);
        }

        return this.userRepo.save(user);
    }
}

@Injectable()
export class FindRoleByIdUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryPort,
    ) { }

    async execute(roleId: number) {
        const role = await this.roleRepo.findById(roleId);
        if (!role) throw new NotFoundException(errorMessages.role.notFound);
        return role;
    }
}
