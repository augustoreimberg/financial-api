import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { LoggingInterceptor } from "./infrastructure/interceptors/logging.interceptor"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor())

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Financial Wallet API")
    .setDescription("API for managing financial wallets and transactions")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  await app.listen(3000)
}
bootstrap()
