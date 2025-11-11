import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(email: string, password: string, name: string) {
    const user = await this.usersService.create(email, password, name)
    // TODO: Generate JWT token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'User registered successfully',
    }
  }

  async login(email: string, password: string) {
    // TODO: Implement JWT authentication
    return {
      message: 'Login endpoint - to be implemented with JWT',
    }
  }
}
