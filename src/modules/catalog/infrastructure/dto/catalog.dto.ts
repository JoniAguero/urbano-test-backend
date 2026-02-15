import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductInputDto {
    @IsString()
    @IsNotEmpty()
    public title: string;

    @IsString()
    @IsNotEmpty()
    public code: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsString()
    @IsOptional()
    public variationType?: string;

    @IsNumber()
    @IsNotEmpty()
    public categoryId: number;
}

export class UpdateStockDto {
    @IsNumber()
    @IsNotEmpty()
    public quantity: number;
}
