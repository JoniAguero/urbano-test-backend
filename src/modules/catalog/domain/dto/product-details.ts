import { Type } from 'class-transformer';

// ProductDetails is a flexible JSONB structure for product-specific attributes
export class ProductDetails {
    [key: string]: any;
}

// Type function for class-transformer decoration
export const ProductDetailsTypeFn = () => ProductDetails;
