import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common'
import { Prisma } from 'generated/prisma/client'
import { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'Internal server error'

        switch (exception.code) {
            case 'P2002': // @Unique() conflict
                status = HttpStatus.CONFLICT
                message = 'A record with this unique value already exists'
                break

            case 'P2003': // ParentId doesn't exists
                status = HttpStatus.BAD_REQUEST
                message =
                    'Foreign key constraint failed. Check if related records exist'
                break

            case 'P2025': // "Record to update not found" ou "Record to delete not found"
                status = HttpStatus.NOT_FOUND
                message = 'The requested record was not found'
                break

            case 'P1001': // DB offline
                status = HttpStatus.SERVICE_UNAVAILABLE
                message =
                    'Database is unreachable. Please check the infrastructure'
                break
        }

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(), // Boa prática: logar o tempo
            path: ctx.getRequest().url, // Boa prática: mostrar onde deu erro
        })
    }
}
