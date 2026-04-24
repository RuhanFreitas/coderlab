import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
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

    async findAll(params: { name?: string; page: number; limit: number }) {
        const { name, page, limit } = params
        const skip = (page - 1) * limit

        const where = name
            ? {
                  name: {
                      contains: name,
                      mode: 'insensitive' as const,
                  },
              }
            : {}

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: { categories: true },
                orderBy: { id: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ])

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        }
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
