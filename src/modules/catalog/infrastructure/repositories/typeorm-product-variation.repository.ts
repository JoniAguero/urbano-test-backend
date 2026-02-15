import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariation } from 'src/database/entities/productVariation.entity';
import { ProductVariationRepositoryPort } from '../../domain/ports/product-variation.repository.port';

@Injectable()
export class TypeOrmProductVariationRepository implements ProductVariationRepositoryPort {
    constructor(
        @InjectRepository(ProductVariation)
        private readonly repository: Repository<ProductVariation>,
    ) { }

    async save(data: Partial<ProductVariation>): Promise<ProductVariation> {
        return this.repository.save(data);
    }

    async findByProductId(productId: number): Promise<ProductVariation[]> {
        return this.repository.find({ where: { productId } });
    }
}
