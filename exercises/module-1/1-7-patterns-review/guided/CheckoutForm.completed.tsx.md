# Exercise 1-7 Solution: CheckoutForm

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
  const { cart, clearCart, total } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearCart();
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <div className="checkout-success">Thank you for your order!</div>;
  }

  if (cart.length === 0) {
    return <div className="checkout-empty">Your cart is empty</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Checkout</h2>
      <p className="total">Total: ${total.toFixed(2)}</p>

      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```
