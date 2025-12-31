# Exercise 2-6 Solution: CheckoutForm

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  name: z.string().min(1, 'Name is required').min(2, 'Name too short'),
  address: z.object({
    street: z.string().min(1, 'Street required'),
    city: z.string().min(1, 'City required'),
    state: z.string().min(1, 'State required'),
    zip: z.string().min(1, 'ZIP required').regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP'),
  }),
  saveInfo: z.boolean().default(false),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Order placed:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold">Checkout</h2>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" type="email" {...register('email')} className="mt-1 block w-full rounded border-gray-300" />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
        <input id="name" {...register('name')} className="mt-1 block w-full rounded border-gray-300" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium">Shipping Address</legend>

        <div>
          <label htmlFor="street" className="block text-sm font-medium">Street</label>
          <input id="street" {...register('address.street')} className="mt-1 block w-full rounded border-gray-300" />
          {errors.address?.street && <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium">City</label>
            <input id="city" {...register('address.city')} className="mt-1 block w-full rounded border-gray-300" />
            {errors.address?.city && <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium">State</label>
            <input id="state" {...register('address.state')} className="mt-1 block w-full rounded border-gray-300" />
            {errors.address?.state && <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>}
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium">ZIP</label>
            <input id="zip" {...register('address.zip')} className="mt-1 block w-full rounded border-gray-300" />
            {errors.address?.zip && <p className="mt-1 text-sm text-red-600">{errors.address.zip.message}</p>}
          </div>
        </div>
      </fieldset>

      <div className="flex items-center">
        <input id="saveInfo" type="checkbox" {...register('saveInfo')} className="h-4 w-4 rounded" />
        <label htmlFor="saveInfo" className="ml-2 text-sm">Save my information</label>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400">
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```
