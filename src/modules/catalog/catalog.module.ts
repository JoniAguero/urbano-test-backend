import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';
import { ProductVariation } from 'src/database/entities/productVariation.entity';
import { PRODUCT_REPOSITORY, PRODUCT_VARIATION_REPOSITORY } from 'src/shared/tokens';
import { TypeOrmProductRepository } from './infrastructure/repositories/typeorm-product.repository';
import { TypeOrmProductVariationRepository } from './infrastructure/repositories/typeorm-product-variation.repository';
import { CatalogController } from './infrastructure/controllers/catalog.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, ProductVariation])],
    controllers: [CatalogController],
    providers: [
        {
            provide: PRODUCT_REPOSITORY,
            useClass: TypeOrmProductRepository,
        },
        {
            provide: PRODUCT_VARIATION_REPOSITORY,
            useClass: TypeOrmProductVariationRepository,
        },
        CreateProductUseCase,
        GetProductUseCase,
        GetAllProductsUseCase,
        DeleteProductUseCase,
    ],
    exports: [PRODUCT_REPOSITORY, PRODUCT_VARIATION_REPOSITORY],
})
export class CatalogModule { }
