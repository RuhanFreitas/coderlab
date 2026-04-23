import { Test, TestingModule } from '@nestjs/testing'
import { CategoryService } from './category.service'
import { PrismaService } from '../prisma/prisma.service'
import { BadRequestException } from '@nestjs/common'

describe('CategoryService', () => {
    let service: CategoryService
    let prisma: PrismaService

    const mockPrisma = {
        category: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile()

        service = module.get<CategoryService>(CategoryService)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('update', () => {
        it('should throw BadRequestException if category is assigned as its own parent', async () => {
            const categoryId = 1
            const updateDto = { parentId: 1 }

            // Precisamos simular que a categoria existe para não cair no NotFoundException
            ;(prisma.category.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'Teste',
            })

            await expect(service.update(categoryId, updateDto)).rejects.toThrow(
                BadRequestException,
            )
        })

        it('should throw BadRequestException if parentId creates a circular dependency', async () => {
            const categoryId = 1
            const updateDto = { parentId: 2 }

            // 1. Simula que a categoria que está sendo editada existe
            ;(prisma.category.findUnique as jest.Mock)
                .mockResolvedValueOnce({ id: 1, name: 'Filha' }) // Para o findOne
                .mockResolvedValueOnce({ id: 2, parentId: 1 }) // Para a validação de hierarquia (o pai já é filho da categoria)

            await expect(service.update(categoryId, updateDto)).rejects.toThrow(
                'The father cannot be a descendant', // Mudamos para a sua mensagem real
            )
        })
    })
})
