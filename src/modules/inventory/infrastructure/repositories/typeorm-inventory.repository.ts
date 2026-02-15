import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from 'src/database/entities/inventory.entity';
import { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port';

@Injectable()
export class TypeOrmInventoryRepository implements InventoryRepositoryPort {
    constructor(
        @InjectRepository(Inventory)
        private readonly repo: Repository<Inventory>,
    ) { }

    async createForProduct(
        productVariationId: number,
        countryCode: string,
        quantity: number,
    ): Promise<Inventory> {
        const inventory = this.repo.create({
            productVariationId,
            countryCode,
            quantity,
        });
        return this.repo.save(inventory);
    }

    async findByProductVariation(productVariationId: number): Promise<Inventory | null> {
        return this.repo.findOne({
            where: { productVariationId },
            relations: ['productVariation', 'country'],
        });
    }

    async findAll(): Promise<Inventory[]> {
        return this.repo.find({
            relations: ['productVariation', 'country'],
            order: { createdAt: 'DESC' },
        });
    }

    async updateStock(id: number, quantity: number): Promise<Inventory | null> {
        await this.repo.update(id, { quantity });
        return this.repo.findOne({ where: { id } });
    }
}
