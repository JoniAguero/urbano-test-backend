import {
    Inject,
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { UserRepositoryPort } from 'src/modules/users/domain/ports/user.repository.port';
import { RoleRepositoryPort } from 'src/modules/roles/domain/ports/role.repository.port';
import { USER_REPOSITORY, ROLE_REPOSITORY } from 'src/shared/tokens';
import { LoginDto, RegisterDto, PayloadDto } from '../../infrastructure/dto/auth.dto';
import { errorMessages } from 'src/errors/custom';
import { RoleIds } from 'src/modules/roles/domain/enums/role.enum';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async execute(data: LoginDto) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user) throw new UnauthorizedException(errorMessages.auth.wronCredentials);

        const valid = await compare(data.password, user.password);
        if (!valid) throw new UnauthorizedException(errorMessages.auth.wronCredentials);

        const payload: PayloadDto = { id: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.secret'),
        });

        return { accessToken };
    }
}

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepo: RoleRepositoryPort,
    ) { }

    async execute(data: RegisterDto) {
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing) throw new ConflictException(errorMessages.auth.userAlreadyExist);

        const customerRole = await this.roleRepo.findById(RoleIds.Customer);
        await this.userRepo.create({ email: data.email, password: data.password }, [customerRole]);

        return { message: 'success' };
    }
}
