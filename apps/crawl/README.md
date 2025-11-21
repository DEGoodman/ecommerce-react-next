# CRAWL Phase - React & TypeScript Fundamentals

This is the beginner phase of the e-commerce learning platform. It uses simple, foundational technologies to teach React and TypeScript basics.

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Express.js + TypeScript
- **State**: React Context API

## Getting Started

```bash
cd apps/crawl

# Install dependencies
pnpm install --recursive

# Run with Docker (recommended)
docker compose up

# Or run locally
cd frontend && pnpm dev
cd backend && pnpm dev
```

## What You'll Learn

- React components and props
- TypeScript interfaces and types
- useState and useEffect hooks
- Context API for global state
- Basic REST API integration
- Docker containerization

## Key Files to Study

### Frontend
- `src/context/CartContext.tsx` - Context API pattern
- `src/components/ProductList.tsx` - Data fetching with useEffect
- `src/components/Cart.tsx` - State management
- `src/types/index.ts` - TypeScript type definitions

### Backend
- `src/index.ts` - Express server setup
- `src/routes/products.ts` - REST API routes

## Exercises

After understanding the code, try these:

1. Add a search bar (client-side filtering)
2. Persist cart to localStorage
3. Add loading skeletons
4. Create a product category filter
5. Add a checkout form

## Next Steps

Once comfortable with these patterns, move to the WALK phase to learn Next.js and more advanced patterns.
