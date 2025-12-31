# Exercise 2-7: Authentication with NextAuth.js

## User Story
As a user, I want to log in so I can access protected features like checkout and order history.

## Acceptance Criteria
- [ ] NextAuth configured with credentials provider
- [ ] Custom login page at `/login`
- [ ] Protected routes via middleware (checkout, profile)
- [ ] Session accessible in both server and client components
- [ ] Sign out functionality

## Concepts to Apply
- NextAuthOptions configuration
- CredentialsProvider for email/password
- SessionProvider for client access
- middleware.ts for route protection
- getServerSession for server components

## Starter Code

```ts
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Validate credentials exist
        // TODO: Call backend API to verify
        // TODO: Return user object or null
        return null;
      },
    }),
  ],
  pages: {
    // TODO: Set custom sign in page
  },
  callbacks: {
    // TODO: Add jwt and session callbacks to include user id
  },
  session: {
    strategy: 'jwt',
  },
};
```

```ts
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  // TODO: Configure pages
});

export const config = {
  // TODO: Add matcher for protected routes
};
```

## Hints
- signIn('credentials', { redirect: false }) for client-side login
- router.refresh() after login to update server components
- getServerSession(authOptions) in server components
- useSession() hook in client components
