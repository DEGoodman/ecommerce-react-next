# Exercise 3-3: Database & TypeORM - Order Entity

## User Story
As a shopper, I want to place orders that contain multiple products.

## Acceptance Criteria
- [ ] Order entity with userId, status, total, shippingAddress
- [ ] OrderItem entity linking orders to products with quantity
- [ ] OrderStatus enum (pending, processing, shipped, delivered, cancelled)
- [ ] Relationships: User → Orders (one-to-many), Order → Items (one-to-many)
- [ ] Transaction support for order creation
- [ ] Stock decreases when order is placed

## Concepts to Apply
- @OneToMany and @ManyToOne decorators
- Enum columns in TypeORM
- Cascade and eager loading
- Transactions with queryRunner
- Nested DTO validation

## Starter Code

```ts
// orders/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export enum OrderStatus {
  // TODO: Define status values
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Add userId column
  // TODO: Add ManyToOne to User
  // TODO: Add OneToMany to OrderItem
  // TODO: Add status (enum), total, shippingAddress columns
  // TODO: Add timestamps
}
```

```ts
// orders/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('order_items')
export class OrderItem {
  // TODO: Add id, orderId, productId columns
  // TODO: Add ManyToOne relationships
  // TODO: Add quantity, price columns
}
```

```ts
// orders/dto/create-order.dto.ts
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// TODO: Create OrderItemDto with productId, quantity
// TODO: Create CreateOrderDto with items array, shippingAddress
```

## Hints
- Use `{ cascade: true, eager: true }` on OneToMany for auto-save/load
- `@Type(() => OrderItemDto)` needed for nested validation
- Use `queryRunner.startTransaction()` for atomic operations
- Store product price in OrderItem (prices can change over time)
