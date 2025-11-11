/**
 * Product Entity
 *
 * TypeORM entity representing products in the database.
 * Demonstrates:
 * - Entity decorators
 * - Column types and constraints
 * - Timestamps
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column('text')
  description: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column({ nullable: true })
  imageUrl: string

  @Column()
  category: string

  @Column('int', { default: 0 })
  stock: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
