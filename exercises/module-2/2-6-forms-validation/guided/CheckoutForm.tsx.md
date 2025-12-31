# Exercise 2-6 Guided: Forms & Validation with React Hook Form + Zod

## Learning Goals
Build robust forms with React Hook Form and Zod schema validation.

## Why This Stack?

- **React Hook Form**: Minimal re-renders, easy integration
- **Zod**: TypeScript-first schema validation, type inference
- **Together**: Schema defines both validation AND TypeScript types

## Step 1: Install and Setup

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

## Step 2: Define the Schema

```tsx
// schemas/checkout.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),

  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z
      .string()
      .min(1, 'ZIP code is required')
      .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  }),

  saveInfo: z.boolean().default(false),
});

// Infer TypeScript type from schema
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

## Step 3: Basic Form Component

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/schemas/checkout';

export function CheckoutForm() {
  const {
    register,       // Connect inputs to form
    handleSubmit,   // Handle form submission
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      saveInfo: false,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('Form data:', data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields go here */}
    </form>
  );
}
```

## Step 4: Add Form Fields with Error Display

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/schemas/checkout';

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Order placed:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold">Checkout</h2>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Address Fields */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium">Shipping Address</legend>

        <div>
          <label htmlFor="street" className="block text-sm font-medium">
            Street Address
          </label>
          <input
            id="street"
            {...register('address.street')}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
          {errors.address?.street && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.street.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium">
              City
            </label>
            <input
              id="city"
              {...register('address.city')}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
            {errors.address?.city && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.city.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium">
              State
            </label>
            <input
              id="state"
              {...register('address.state')}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
            {errors.address?.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.state.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium">
              ZIP
            </label>
            <input
              id="zip"
              {...register('address.zip')}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
            {errors.address?.zip && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.zip.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Checkbox */}
      <div className="flex items-center">
        <input
          id="saveInfo"
          type="checkbox"
          {...register('saveInfo')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="saveInfo" className="ml-2 text-sm">
          Save my information for next time
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

## Key Concepts

1. **Zod schema**: Defines validation rules and generates TypeScript types
2. **zodResolver**: Bridges Zod with React Hook Form
3. **register()**: Connects inputs to the form state
4. **handleSubmit()**: Validates before calling onSubmit
5. **errors object**: Access field-specific error messages
6. **Nested fields**: Use dot notation like `address.street`
