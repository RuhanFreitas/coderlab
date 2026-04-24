import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    Patch,
    Query,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDTO } from './dto/create-product.dto'
import { UpdateProductDTO } from './dto/update-product.dto'

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDTO) {
        return this.productService.create(createProductDto)
    }

    @Get()
    async findAll(
        @Query('name') name?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.productService.findAll({
            name,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        })
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id)
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDTO,
    ) {
        return this.productService.update(id, updateProductDto)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id)
    }
}
