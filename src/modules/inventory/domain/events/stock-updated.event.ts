import { DomainEvent } from 'src/shared/domain/domain-event';

export class StockUpdatedEvent extends DomainEvent {
    constructor(
        public readonly inventoryId: number,
        public readonly productVariationId: number,
        public readonly previousQuantity: number,
        public readonly newQuantity: number,
    ) {
        super('stock.updated');
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            inventoryId: this.inventoryId,
            productVariationId: this.productVariationId,
            previousQuantity: this.previousQuantity,
            newQuantity: this.newQuantity,
        };
    }
}
