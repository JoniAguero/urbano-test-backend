import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/role.entity';
import { ROLE_REPOSITORY } from 'src/shared/tokens';
import { TypeOrmRoleRepository } from './infrastructure/repositories/typeorm-role.repository';
import { AssignRoleUseCase, FindRoleByIdUseCase } from './application/use-cases/role.use-cases';
import { RoleController } from './infrastructure/controllers/role.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), UsersModule],
    controllers: [RoleController],
    providers: [
        {
            provide: ROLE_REPOSITORY,
            useClass: TypeOrmRoleRepository,
        },
        AssignRoleUseCase,
        FindRoleByIdUseCase,
    ],
    exports: [ROLE_REPOSITORY, FindRoleByIdUseCase],
})
export class RolesModule { }
