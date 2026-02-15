import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase, RegisterUseCase } from '../../application/use-cases/auth.use-cases';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
    ) { }

    @Post('login')
    login(@Body() data: LoginDto) {
        return this.loginUseCase.execute(data);
    }

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.registerUseCase.execute(data);
    }
}
