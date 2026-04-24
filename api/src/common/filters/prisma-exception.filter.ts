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
        const request = ctx.getRequest()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'Internal server error'

        switch (exception.code) {
            case 'P2002':
                status = HttpStatus.CONFLICT
                const fields =
                    (exception.meta?.target as string[])?.join(', ') || 'field'
                message = `Unique constraint failed on ${fields}`
                break

            case 'P2003':
                status = HttpStatus.BAD_REQUEST
                message =
                    'Foreign key constraint failed. Related record not found or dependency exists.'
                break

            case 'P2025':
                status = HttpStatus.NOT_FOUND
                message = exception.message || 'Record not found'
                break

            case 'P2000': // Value too long for column
                status = HttpStatus.BAD_REQUEST
                message =
                    'The provided value is too long for one of the fields.'
                break

            case 'P1001':
            case 'P1008': // Operations timed out
                status = HttpStatus.SERVICE_UNAVAILABLE
                message = 'Database is unreachable or timed out.'
                break

            default:
                // Logar o erro original no console para debug em desenvolvimento
                console.error(exception)
                message = `Unhandled database error: ${exception.code}`
                break
        }

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
            errorCode: exception.code,
        })
    }
}
