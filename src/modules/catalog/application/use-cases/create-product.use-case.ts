import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductVariationRepositoryPort } from '../../domain/ports/product-variation.repository.port';
import { EventBus } from 'src/shared/event-bus/event-bus.port';
import { ProductCreatedEvent } from '../../domain/events/product-created.event';
import { PRODUCT_REPOSITORY, PRODUCT_VARIATION_REPOSITORY, EVENT_BUS } from 'src/shared/tokens';
import { CreateProductInputDto } from '../../infrastructure/dto/catalog.dto';

@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: ProductRepositoryPort,
        @Inject(PRODUCT_VARIATION_REPOSITORY)
        private readonly variationRepo: ProductVariationRepositoryPort,
        @Inject(EVENT_BUS)
        private readonly eventBus: EventBus,
    ) { }

    async execute(data: CreateProductInputDto, merchantId: number) {
        const product = await this.productRepo.save({
            title: data.title,
            code: data.code,
            description: data.description,
            variationType: data.variationType,
            categoryId: data.categoryId,
            merchantId,
        });

        // Create default variation for inventory
        const variation = await this.variationRepo.save({
            productId: product.id,
            colorName: 'NA',
            sizeCode: 'NA',
        });

        await this.eventBus.publish(
            new ProductCreatedEvent(
                product.id,
                variation.id,
                product.title,
                product.categoryId,
                merchantId,
            ),
        );

        return product;
    }
}
