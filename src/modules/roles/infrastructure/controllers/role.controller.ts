import { Body, Controller, Post } from '@nestjs/common';
import { AssignRoleUseCase } from '../../application/use-cases/role.use-cases';
import { AssignRoleDto } from '../dto/role.dto';
import { Auth } from 'src/shared/guards/auth.decorator';
import { RoleIds } from '../../domain/enums/role.enum';

@Controller('role')
export class RoleController {
    constructor(private readonly assignRole: AssignRoleUseCase) { }

    @Auth(RoleIds.Admin)
    @Post('assign')
    async assignRoleToUser(@Body() body: AssignRoleDto) {
        return this.assignRole.execute(body);
    }
}
