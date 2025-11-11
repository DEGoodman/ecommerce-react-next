import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'E-Commerce API',
      version: '0.1.0',
      endpoints: {
        health: '/api/health',
        products: '/api/products',
        cart: '/api/cart',
        orders: '/api/orders',
        auth: '/api/auth',
      },
    }
  }
}
