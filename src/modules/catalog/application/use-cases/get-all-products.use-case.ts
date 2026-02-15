import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { PRODUCT_REPOSITORY } from 'src/shared/tokens';

@Injectable()
export class GetAllProductsUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: ProductRepositoryPort,
    ) { }

    async execute() {
        return this.productRepo.findAll();
    }
}
