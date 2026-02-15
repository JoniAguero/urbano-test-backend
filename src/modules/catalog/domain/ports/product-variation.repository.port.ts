import { ProductVariation } from 'src/database/entities/productVariation.entity';

export interface ProductVariationRepositoryPort {
    save(data: Partial<ProductVariation>): Promise<ProductVariation>;
    findByProductId(productId: number): Promise<ProductVariation[]>;
}
