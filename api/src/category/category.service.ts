import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCategoryDTO } from './dto/create-category.dto'

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.category.findMany({
            include: { children: true, parent: true },
        })
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { children: true, parent: true },
        })

        if (!category) throw new NotFoundException(`Category ${id} not found`)

        return category
    }

    async create(createCategoryDTO: CreateCategoryDTO) {
        return this.prisma.category.create({
            data: {
                name: createCategoryDTO.name,
                parentId: createCategoryDTO.parentId,
            },
        })
    }

    async update(id: number, data: { name?: string; parentId?: number }) {
        if (data.parentId) {
            await this.validateHierarchy(id, data.parentId)
        }

        return this.prisma.category.update({
            where: { id },
            data,
        })
    }

    async remove(id: number) {
        return this.prisma.category.delete({
            where: { id },
        })
    }

    private async validateHierarchy(categoryId: number, newParentId: number) {
        if (categoryId === newParentId) {
            throw new BadRequestException('A category cannot be its own parent')
        }

        const parent = await this.prisma.category.findUnique({
            where: { id: newParentId },
        })

        if (!parent)
            throw new NotFoundException(
                `Parent category ${newParentId} not found`,
            )

        let currentParent = parent

        while (currentParent?.parentId) {
            if (currentParent.parentId === categoryId) {
                throw new BadRequestException(
                    'The father cannot be a descendant',
                )
            }

            const nextParent = await this.prisma.category.findUnique({
                where: { id: currentParent.parentId },
            })

            if (!nextParent) break

            currentParent = nextParent
        }
    }
}
