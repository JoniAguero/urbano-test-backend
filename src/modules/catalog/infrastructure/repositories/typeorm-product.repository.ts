import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';

@Injectable()
export class TypeOrmProductRepository implements ProductRepositoryPort {
    constructor(
        @InjectRepository(Product)
        private readonly repo: Repository<Product>,
    ) { }

    async save(data: Partial<Product>): Promise<Product> {
        const product = this.repo.create(data);
        return this.repo.save(product);
    }

    async findById(id: number): Promise<Product | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['category'],
        });
    }

    async findAll(): Promise<Product[]> {
        return this.repo.find({
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }

    async delete(id: number, merchantId: number): Promise<boolean> {
        const result = await this.repo.delete({ id, merchantId });
        return result.affected > 0;
    }
}
