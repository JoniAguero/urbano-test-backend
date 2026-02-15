import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserRepositoryPort } from 'src/modules/users/domain/ports/user.repository.port';
import { USER_REPOSITORY } from 'src/shared/tokens';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryPort,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const bearerToken = request.headers.authorization.split(' ')[1];
            const payload = await this.jwtService.verifyAsync(bearerToken, {
                secret: process.env.JWT_SECRET,
            });
            request.user = await this.userRepo.findById(payload.id, { roles: true });
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError)
                throw new UnauthorizedException(errorMessages.auth.expiredToken);
            throw new UnauthorizedException(errorMessages.auth.invlidToken);
        }
    }
}
