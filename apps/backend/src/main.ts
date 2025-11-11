/**
 * Main application entry point
 *
 * This file bootstraps the NestJS application and configures:
 * - CORS for frontend communication
 * - Global validation pipes
 * - API versioning
 */

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // Global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // API prefix
  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3001
  await app.listen(port)

  console.log(`🚀 Backend server is running on http://localhost:${port}`)
  console.log(`📚 API documentation available at http://localhost:${port}/api`)
}

bootstrap()
