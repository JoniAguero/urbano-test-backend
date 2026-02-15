import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port';
import { EventBus } from 'src/shared/event-bus/event-bus.port';
import { StockUpdatedEvent } from '../../domain/events/stock-updated.event';
import { INVENTORY_REPOSITORY, EVENT_BUS } from 'src/shared/tokens';

@Injectable()
export class UpdateStockUseCase {
    constructor(
        @Inject(INVENTORY_REPOSITORY)
        private readonly inventoryRepo: InventoryRepositoryPort,
        @Inject(EVENT_BUS)
        private readonly eventBus: EventBus,
    ) { }

    async execute(inventoryId: number, quantity: number) {
        const current = await this.inventoryRepo.findByProductVariation(inventoryId);
        if (!current) throw new NotFoundException('Inventory record not found');

        const previousQuantity = current.quantity;
        const updated = await this.inventoryRepo.updateStock(current.id, quantity);

        await this.eventBus.publish(
            new StockUpdatedEvent(
                updated.id,
                updated.productVariationId,
                previousQuantity,
                quantity,
            ),
        );

        return updated;
    }
}
