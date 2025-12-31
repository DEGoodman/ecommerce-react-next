# Exercise 2-10: Advanced Patterns

## User Story
As a developer, I want production-ready patterns for auth, images, SEO, and caching.

## Acceptance Criteria
- [ ] Middleware protects checkout/profile routes
- [ ] Redirects unauthenticated users to login
- [ ] Product images use next/image with proper sizing
- [ ] Dynamic metadata for product pages
- [ ] OpenGraph tags for social sharing

## Concepts to Apply
- Middleware for route protection
- next/image optimization
- generateMetadata for dynamic SEO
- Revalidation strategies

## Starter Code

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: Check for auth token
  // TODO: Define protected paths
  // TODO: Redirect to login if unauthenticated
  // TODO: Redirect from login if already authenticated

  return NextResponse.next();
}

export const config = {
  matcher: [
    // TODO: Add paths to protect
  ],
};
```

```tsx
// app/products/[id]/page.tsx
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // TODO: Fetch product
  // TODO: Return metadata with title, description, openGraph

  return {
    title: 'Product',
  };
}
```

## Hints
- `getToken({ req: request })` from next-auth/jwt for auth check
- matcher uses path patterns: `/path/:segment*`
- generateMetadata can be async and fetch data
- openGraph images array: `[{ url: product.image }]`
