import { Product } from 'src/database/entities/product.entity';

export interface ProductRepositoryPort {
    save(data: Partial<Product>): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    delete(id: number, merchantId: number): Promise<boolean>;
}
