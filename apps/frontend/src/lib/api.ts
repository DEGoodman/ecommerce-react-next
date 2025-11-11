/**
 * API client for communicating with the backend
 *
 * This module provides typed functions for making API requests.
 * It uses axios for HTTP requests and includes error handling.
 */

import axios, { AxiosInstance } from 'axios'
import type { Product, Cart, Order, User, ApiResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await this.client.get<ApiResponse<Product[]>>('/products')
    return response.data.data
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.client.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data
  }

  // Cart
  async getCart(userId?: string): Promise<Cart> {
    const response = await this.client.get<ApiResponse<Cart>>('/cart', {
      params: { userId },
    })
    return response.data.data
  }

  async addToCart(productId: string, quantity: number): Promise<Cart> {
    const response = await this.client.post<ApiResponse<Cart>>('/cart/items', {
      productId,
      quantity,
    })
    return response.data.data
  }

  // Orders
  async createOrder(cartId: string): Promise<Order> {
    const response = await this.client.post<ApiResponse<Order>>('/orders', {
      cartId,
    })
    return response.data.data
  }

  async getOrders(userId: string): Promise<Order[]> {
    const response = await this.client.get<ApiResponse<Order[]>>('/orders', {
      params: { userId },
    })
    return response.data.data
  }
}

export const apiClient = new ApiClient(API_URL)
