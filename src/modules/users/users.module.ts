import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { USER_REPOSITORY } from 'src/shared/tokens';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { FindUserByIdUseCase, FindUserByEmailUseCase } from './application/use-cases/user.use-cases';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: TypeOrmUserRepository,
        },
        FindUserByIdUseCase,
        FindUserByEmailUseCase,
    ],
    exports: [USER_REPOSITORY, FindUserByIdUseCase, FindUserByEmailUseCase],
})
export class UsersModule { }
