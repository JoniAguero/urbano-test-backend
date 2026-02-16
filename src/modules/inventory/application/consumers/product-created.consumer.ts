import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from 'src/modules/catalog/domain/events/product-created.event';
import { InitializeInventoryUseCase } from '../use-cases/initialize-inventory.use-case';

@Injectable()
export class ProductCreatedConsumer {
    private readonly logger = new Logger(ProductCreatedConsumer.name);

    constructor(
        private readonly initializeInventory: InitializeInventoryUseCase,
    ) { }

    @OnEvent('product.created')
    async handle(event: ProductCreatedEvent) {
        console.log(`[ProductCreatedConsumer] Received product.created event:`, JSON.stringify(event));
        this.logger.log(
            `Consuming product.created event for variation=${event.productVariationId} (product=${event.productId}, ${event.title})`,
        );

        try {
            await this.initializeInventory.execute(event.productVariationId);
            console.log(`[ProductCreatedConsumer] Inventory initialized successfully for variation ${event.productVariationId}`);
            this.logger.log(
                `Inventory initialized for variation=${event.productVariationId}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to initialize inventory for product=${event.productId}: ${error.message}`,
                error.stack,
            );
        }
    }
}
