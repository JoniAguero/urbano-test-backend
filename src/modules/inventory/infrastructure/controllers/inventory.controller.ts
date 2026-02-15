import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
} from '@nestjs/common';
import { GetInventoryUseCase } from '../../application/use-cases/get-inventory.use-case';
import { UpdateStockUseCase } from '../../application/use-cases/update-stock.use-case';
import { Auth } from 'src/shared/guards/auth.decorator';
import { RoleIds } from 'src/modules/roles/domain/enums/role.enum';

@Controller('inventory')
export class InventoryController {
    constructor(
        private readonly getInventory: GetInventoryUseCase,
        private readonly updateStock: UpdateStockUseCase,
    ) { }

    @Get()
    async findAll() {
        return this.getInventory.executeAll();
    }

    @Get(':productVariationId')
    async findByProduct(
        @Param('productVariationId', ParseIntPipe) productVariationId: number,
    ) {
        return this.getInventory.execute(productVariationId);
    }

    @Auth(RoleIds.Admin, RoleIds.Merchant)
    @Patch(':id/stock')
    async patchStock(
        @Param('id', ParseIntPipe) id: number,
        @Body('quantity', ParseIntPipe) quantity: number,
    ) {
        return this.updateStock.execute(id, quantity);
    }
}
