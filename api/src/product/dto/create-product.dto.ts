import { Type } from 'class-transformer'
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    ArrayMinSize,
} from 'class-validator'

export class CreateProductDTO {
    @IsString({ message: 'Product name must be a string' })
    @IsNotEmpty({ message: 'Product name is required' })
    name: string

    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price cannot be negative' })
    @Type(() => Number)
    price: number

    @IsArray({ message: 'Category IDs must be an array' })
    @ArrayMinSize(1, { message: 'Product must have at least one category' })
    @IsInt({ each: true, message: 'Each category ID must be an integer' })
    categoryIds: number[]
}
