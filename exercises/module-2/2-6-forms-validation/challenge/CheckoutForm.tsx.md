# Exercise 2-6: Forms & Validation - CheckoutForm

## User Story
As a shopper, I want a validated checkout form so I can complete my purchase with confidence.

## Acceptance Criteria
- [ ] Form with email, name, and address fields
- [ ] Zod schema validates all fields
- [ ] Error messages display under invalid fields
- [ ] Submit button disabled while submitting
- [ ] Nested address object (street, city, state, zip)
- [ ] ZIP code validates format (12345 or 12345-6789)

## Concepts to Apply
- React Hook Form with useForm hook
- Zod schema definition
- zodResolver for integration
- register() for input binding
- Error display pattern

## Starter Code

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// TODO: Define checkoutSchema with Zod
// Fields: email, name, address (street, city, state, zip), saveInfo

const checkoutSchema = z.object({
  // Define your schema here
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
    // TODO: Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* TODO: Add form fields with register() */}
      {/* TODO: Display errors from errors object */}
      {/* TODO: Add submit button with isSubmitting state */}
    </form>
  );
}
```

## Hints
- Zod email: `z.string().email('message')`
- Zod regex: `z.string().regex(/pattern/, 'message')`
- Nested objects: `z.object({ ... })` inside main object
- Access nested errors: `errors.address?.street?.message`
- Nested register: `{...register('address.street')}`
