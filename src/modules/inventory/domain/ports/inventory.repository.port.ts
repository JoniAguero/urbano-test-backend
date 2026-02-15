import { Inventory } from 'src/database/entities/inventory.entity';

export interface InventoryRepositoryPort {
    createForProduct(productVariationId: number, countryCode: string, quantity: number): Promise<Inventory>;
    findByProductVariation(productVariationId: number): Promise<Inventory | null>;
    findAll(): Promise<Inventory[]>;
    updateStock(id: number, quantity: number): Promise<Inventory | null>;
}
