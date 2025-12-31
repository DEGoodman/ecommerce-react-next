# Exercise 2-10 Guided: Next.js Advanced Patterns

## Learning Goals
Master production patterns: middleware, Image optimization, metadata, and parallel routes.

## Part 1: Middleware

Middleware runs before every request, enabling:
- Authentication checks
- Redirects
- Request/response modification

```ts
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example: Redirect /products to /shop
  if (pathname === '/products') {
    return NextResponse.redirect(new URL('/shop', request.url));
  }

  // Example: Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');

  return response;
}

// Only run on specific paths
export const config = {
  matcher: ['/products/:path*', '/checkout/:path*'],
};
```

## Part 2: Image Optimization

```tsx
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square">
      {/* Basic usage - fill container */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
    </div>
  );
}

// Fixed dimensions
export function ProductThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      className="rounded-lg"
      priority={false} // Set true for above-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..." // Low-res placeholder
    />
  );
}
```

Configure remote images in next.config.js:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
        port: '',
        pathname: '/products/**',
      },
    ],
  },
};
```

## Part 3: Metadata & SEO

```tsx
// app/products/[id]/page.tsx
import { Metadata } from 'next';
import { getProduct } from '@/lib/api';

interface Props {
  params: { id: string };
}

// Static metadata
export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our products',
};

// Dynamic metadata based on params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.name} | E-Commerce`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);
  return <div>{/* ... */}</div>;
}
```

## Part 4: Parallel Routes (Modal Pattern)

```
app/
  @modal/
    (.)products/[id]/
      page.tsx          # Intercepted route (modal view)
  products/
    [id]/
      page.tsx          # Full page view
  layout.tsx            # Renders both slots
  page.tsx
```

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

```tsx
// app/@modal/(.)products/[id]/page.tsx
// The (.) prefix intercepts at the same level
import { Modal } from '@/components/Modal';

export default async function ProductModal({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <Modal>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </Modal>
  );
}
```

## Part 5: Revalidation Strategies

```tsx
// Time-based revalidation
async function getProducts() {
  const res = await fetch('http://localhost:3001/api/products', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  return res.json();
}

// On-demand revalidation
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { path, tag } = await request.json();

  if (path) {
    revalidatePath(path);
  }
  if (tag) {
    revalidateTag(tag);
  }

  return Response.json({ revalidated: true });
}

// Tagged fetches
async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3001/api/products/${id}`, {
    next: { tags: [`product-${id}`] },
  });
  return res.json();
}
```

## Key Concepts

1. **Middleware**: Runs at the edge, before rendering
2. **Image**: Auto-optimization, responsive sizes, lazy loading
3. **Metadata**: Static or dynamic, OpenGraph/Twitter cards
4. **Parallel routes**: Multiple pages in same layout (@folder)
5. **Intercepting routes**: Modal over existing content ((.)path)
6. **Revalidation**: Time-based or on-demand cache invalidation
