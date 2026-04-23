import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import { PrismaService } from '../prisma/prisma.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('ProductService', () => {
    let service: ProductService
    let prisma: PrismaService

    const mockPrismaService = {
        category: {
            count: jest.fn(),
        },
        product: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile()

        service = module.get<ProductService>(ProductService)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('deve criar um produto com sucesso', async () => {
            const dto = { name: 'Teclado', price: 150, categoryIds: [1] }

            // Mock: Categoria existe
            mockPrismaService.category.count.mockResolvedValue(1)
            mockPrismaService.product.create.mockResolvedValue({
                id: 1,
                ...dto,
            })

            const result = await service.create(dto)

            expect(result.name).toEqual('Teclado')
            expect(prisma.category.count).toHaveBeenCalled()
        })

        it('deve lançar erro se uma categoria não existir', async () => {
            const dto = { name: 'Erro', price: 10, categoryIds: [99] }

            // Mock: Categoria não encontrada
            mockPrismaService.category.count.mockResolvedValue(0)

            await expect(service.create(dto)).rejects.toThrow(
                BadRequestException,
            )
        })
    })

    describe('findAll', () => {
        it('deve retornar produtos paginados e filtrados', async () => {
            const products = [{ id: 1, name: 'Mouse' }]
            mockPrismaService.product.findMany.mockResolvedValue(products)
            mockPrismaService.product.count.mockResolvedValue(1)

            const result = await service.findAll({
                name: 'Mouse',
                page: 1,
                limit: 10,
            })

            expect(result.data).toEqual(products)
            expect(result.meta.total).toBe(1)
            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { name: { contains: 'Mouse', mode: 'insensitive' } },
                }),
            )
        })
    })

    describe('findOne', () => {
        it('deve retornar um produto se encontrado', async () => {
            const product = { id: 1, name: 'Monitor' }
            mockPrismaService.product.findUnique.mockResolvedValue(product)

            expect(await service.findOne(1)).toEqual(product)
        })

        it('deve lançar NotFoundException se o produto não existir', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null)

            await expect(service.findOne(999)).rejects.toThrow(
                NotFoundException,
            )
        })
    })

    describe('remove', () => {
        it('deve deletar um produto', async () => {
            mockPrismaService.product.delete.mockResolvedValue({ id: 1 })

            const result = await service.remove(1)
            expect(result.id).toBe(1)
            expect(prisma.product.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            })
        })
    })
})
