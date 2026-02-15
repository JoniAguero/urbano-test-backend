import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/database/entities/inventory.entity';
import { INVENTORY_REPOSITORY } from 'src/shared/tokens';
import { TypeOrmInventoryRepository } from './infrastructure/repositories/typeorm-inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { InitializeInventoryUseCase } from './application/use-cases/initialize-inventory.use-case';
import { UpdateStockUseCase } from './application/use-cases/update-stock.use-case';
import { GetInventoryUseCase } from './application/use-cases/get-inventory.use-case';
import { ProductCreatedConsumer } from './application/consumers/product-created.consumer';

@Module({
    imports: [TypeOrmModule.forFeature([Inventory])],
    controllers: [InventoryController],
    providers: [
        {
            provide: INVENTORY_REPOSITORY,
            useClass: TypeOrmInventoryRepository,
        },
        InitializeInventoryUseCase,
        UpdateStockUseCase,
        GetInventoryUseCase,
        ProductCreatedConsumer,
    ],
    exports: [INVENTORY_REPOSITORY],
})
export class InventoryModule { }
