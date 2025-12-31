# Exercise 1-7: Patterns & Review - CheckoutForm

## User Story
As a shopper, I want to complete my purchase with a validated checkout form.

## Acceptance Criteria
- [ ] Form with name, email, and address fields
- [ ] All fields are controlled inputs
- [ ] Validation on submit (all required, valid email format)
- [ ] Shows error messages for invalid fields
- [ ] Clears errors when user types
- [ ] Disables submit while processing
- [ ] Clears cart and shows success on completion
- [ ] Shows empty state if cart is empty

## Concepts to Apply
This capstone combines form patterns with everything from Module 1:
- TypeScript: FormData and FormErrors interfaces
- useState: form state, errors, submitting flag
- Event handling: onChange, onSubmit with proper types
- Context: useCart for cart and clearCart
- Conditional rendering for states

## Starter Code

```tsx
import { useState, FormEvent } from 'react';
import { useCart } from '../context/CartContext';

interface FormData {
  name: string;
  email: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
}

export function CheckoutForm() {
  // TODO: Get cart, clearCart, total from context
  // TODO: Set up state for formData, errors, submitting, submitted
  // TODO: Create handleChange for controlled inputs
  // TODO: Create validate function
  // TODO: Create handleSubmit
  // TODO: Handle empty cart and submitted states
  // TODO: Render form with fields and error display

  return <div>Implement CheckoutForm</div>;
}
```

## Hints
- Store form as single object: `{ name: '', email: '', address: '' }`
- Generic change handler uses `e.target.name` as key
- Email regex: `/\S+@\S+\.\S+/`
- Return early for submitted and empty cart states
- Event type is `FormEvent` for form submit
