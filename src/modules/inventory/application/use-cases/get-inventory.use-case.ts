import { Inject, Injectable } from '@nestjs/common';
import { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port';
import { INVENTORY_REPOSITORY } from 'src/shared/tokens';

@Injectable()
export class GetInventoryUseCase {
    constructor(
        @Inject(INVENTORY_REPOSITORY)
        private readonly inventoryRepo: InventoryRepositoryPort,
    ) { }

    async execute(productVariationId: number) {
        return this.inventoryRepo.findByProductVariation(productVariationId);
    }

    async executeAll() {
        return this.inventoryRepo.findAll();
    }
}
