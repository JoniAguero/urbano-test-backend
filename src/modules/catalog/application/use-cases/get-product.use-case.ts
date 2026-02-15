import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { PRODUCT_REPOSITORY } from 'src/shared/tokens';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class GetProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: ProductRepositoryPort,
    ) { }

    async execute(productId: number) {
        const product = await this.productRepo.findById(productId);
        if (!product) throw new NotFoundException(errorMessages.product.notFound);
        return product;
    }
}
