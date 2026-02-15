import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from 'src/shared/tokens';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class FindUserByIdUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
    ) { }

    async execute(id: number, withRoles = false) {
        const user = await this.userRepo.findById(id, withRoles ? { roles: true } : undefined);
        if (!user) throw new NotFoundException(errorMessages.user.notFound);
        return user;
    }
}

@Injectable()
export class FindUserByEmailUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
    ) { }

    async execute(email: string) {
        return this.userRepo.findByEmail(email);
    }
}
