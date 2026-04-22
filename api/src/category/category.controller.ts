import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async findAll() {
        return this.categoryService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findOne(id)
    }

    @Post()
    async create(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoryService.create(createCategoryDTO)
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDTO: UpdateCategoryDTO,
    ) {
        return this.categoryService.update(id, updateCategoryDTO)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.remove(id)
    }
}
