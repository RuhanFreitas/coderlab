import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    MinLength,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCategoryDTO {
    @IsString({ message: 'Category name must be a string' })
    @IsNotEmpty({ message: 'Category name is required' })
    @MinLength(3, {
        message: 'Category name must be at least 3 characters long',
    })
    name: string

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'parentId must be an integer number' })
    parentId?: number
}
