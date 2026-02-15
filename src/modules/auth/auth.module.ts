import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase, RegisterUseCase } from './application/use-cases/auth.use-cases';

@Module({
    imports: [
        UsersModule,
        RolesModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '3h' },
        }),
    ],
    controllers: [AuthController],
    providers: [LoginUseCase, RegisterUseCase],
})
export class AuthModule { }
