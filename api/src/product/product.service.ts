import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateProductDTO } from './dto/create-product.dto'
import { UpdateProductDTO } from './dto/update-product.dto'

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createProductDTO: CreateProductDTO) {
        const { name, price, categoryIds } = createProductDTO

        const categoriesFound = await this.prisma.category.count({
            where: {
                id: { in: categoryIds },
            },
        })

        if (categoriesFound !== categoryIds.length) {
            throw new BadRequestException(
                'One or more category IDs are invalid or do not exist.',
            )
        }

        return this.prisma.product.create({
            data: {
                name,
                price,
                categories: {
                    connect: categoryIds.map((id) => ({ id })),
                },
            },
            include: {
                categories: true,
            },
        })
    }

    async update(id: number, updateProductDTO: UpdateProductDTO) {
        const { categoryIds, ...productData } = updateProductDTO

        await this.findOne(id)
        if (categoryIds && categoryIds.length > 0) {
            const categoriesFound = await this.prisma.category.count({
                where: { id: { in: categoryIds } },
            })

            if (categoriesFound !== categoryIds.length) {
                throw new BadRequestException(
                    'One or more category IDs are invalid.',
                )
            }
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                ...(categoryIds && {
                    categories: {
                        set: categoryIds.map((id) => ({ id })),
                    },
                }),
            },
            include: { categories: true },
        })
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: { categories: true },
        })
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { categories: true },
        })

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found.`)
        }

        return product
    }

    async remove(id: number) {
        return this.prisma.product.delete({
            where: { id },
        })
    }
}
