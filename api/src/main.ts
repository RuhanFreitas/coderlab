import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { PrismaExceptionFilter } from 'common/filters/prisma-exception.filter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )

    const config = new DocumentBuilder()
        .setTitle('Coderlab API')
        .setDescription('Documentação das rotas de Categorias e Produtos')
        .setVersion('1.0')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    app.useGlobalFilters(new PrismaExceptionFilter())

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
