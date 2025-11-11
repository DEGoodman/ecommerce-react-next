/**
 * Core type definitions for the e-commerce platform
 *
 * These types define the data structures used throughout the application.
 * They should match the API contracts from the backend.
 */

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  items: CartItem[]
  totalPrice: number
  userId?: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}
