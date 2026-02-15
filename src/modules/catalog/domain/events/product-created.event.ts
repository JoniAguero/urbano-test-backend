import { DomainEvent } from 'src/shared/domain/domain-event';

export class ProductCreatedEvent extends DomainEvent {
    constructor(
        public readonly productId: number,
        public readonly productVariationId: number,
        public readonly title: string,
        public readonly categoryId: number,
        public readonly merchantId: number,
    ) {
        super('product.created');
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            productId: this.productId,
            productVariationId: this.productVariationId,
            title: this.title,
            categoryId: this.categoryId,
            merchantId: this.merchantId,
        };
    }
}
