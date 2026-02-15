import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { PRODUCT_REPOSITORY } from 'src/shared/tokens';
import { errorMessages } from 'src/errors/custom';
import { successObject } from 'src/common/helper/sucess-response.interceptor';

@Injectable()
export class DeleteProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: ProductRepositoryPort,
    ) { }

    async execute(productId: number, merchantId: number) {
        const deleted = await this.productRepo.delete(productId, merchantId);
        if (!deleted) throw new NotFoundException(errorMessages.product.notFound);
        return successObject;
    }
}
