import { Inject, Injectable, Logger } from '@nestjs/common';
import { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port';
import { INVENTORY_REPOSITORY } from 'src/shared/tokens';

@Injectable()
export class InitializeInventoryUseCase {
    private readonly logger = new Logger(InitializeInventoryUseCase.name);

    constructor(
        @Inject(INVENTORY_REPOSITORY)
        private readonly inventoryRepo: InventoryRepositoryPort,
    ) { }

    async execute(productVariationId: number, countryCode = 'ARG') {
        this.logger.log(
            `Initializing inventory for productVariation=${productVariationId}`,
        );
        return this.inventoryRepo.createForProduct(productVariationId, countryCode, 0);
    }
}
