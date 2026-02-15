import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { CreateProductInputDto } from '../dto/catalog.dto';
import { Auth } from 'src/shared/guards/auth.decorator';
import { CurrentUser } from 'src/shared/guards/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { RoleIds } from 'src/modules/roles/domain/enums/role.enum';

@Controller('products')
export class CatalogController {
    constructor(
        private readonly createProduct: CreateProductUseCase,
        private readonly getProduct: GetProductUseCase,
        private readonly getAllProducts: GetAllProductsUseCase,
        private readonly deleteProduct: DeleteProductUseCase,
    ) { }

    @Get()
    async findAll() {
        return this.getAllProducts.execute();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getProduct.execute(id);
    }

    @Auth(RoleIds.Admin, RoleIds.Merchant)
    @Post()
    async create(
        @Body() body: CreateProductInputDto,
        @CurrentUser() user: User,
    ) {
        return this.createProduct.execute(body, user.id);
    }

    @Auth(RoleIds.Admin, RoleIds.Merchant)
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return this.deleteProduct.execute(id, user.id);
    }
}
