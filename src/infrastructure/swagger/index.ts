import type { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("Financial Wallet API")
    .setDescription("API for managing financial wallets and transactions")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("api/docs", app, document)
}
