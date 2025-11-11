/**
 * Auth Module
 *
 * Handles authentication and authorization.
 * This is a placeholder for future JWT implementation.
 */

import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
