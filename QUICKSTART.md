# Quick Start Guide

Get the e-commerce platform running in 5 minutes!

## Prerequisites

Make sure you have these installed:

- [Node.js 18+](https://nodejs.org/) (check: `node --version`)
- [pnpm](https://pnpm.io/) (install: `npm install -g pnpm`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Option 1: Docker (Recommended)

The fastest way to get started:

```bash
# 1. Clone and enter directory
git clone <your-repo-url>
cd ecommerce-js

# 2. Start all services with Docker
make docker-up

# 3. Wait about 30 seconds for services to start
# You'll see: ✅ Services started!
```

That's it! Now open:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

### Common Docker Commands

```bash
make docker-logs      # View logs
make docker-down      # Stop services
make docker-restart   # Restart everything
make docker-clean     # Clean up and reset
make db-shell         # Open database shell
```

## Option 2: Local Development

Run services locally without Docker:

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL (you need it running)
# Option A: With Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  postgres:16-alpine

# Option B: Use existing PostgreSQL installation
# Configure connection in apps/backend/.env

# 3. Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Start all services
make dev

# Or start individually:
make dev-frontend     # Frontend only
make dev-backend      # Backend only
```

## Verify Installation

### Test the Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}

# Get API info
curl http://localhost:3001/api

# Should return endpoints list
```

### Test the Frontend

Visit http://localhost:3000 - you should see the home page with:
- Welcome message
- Phase 1/2/3 cards
- Navigation links

## Next Steps

### 1. Explore the Codebase

```bash
# Frontend structure
apps/frontend/src/
  ├── app/          # Pages (routes)
  ├── components/   # React components
  ├── lib/          # Utilities
  └── types/        # TypeScript types

# Backend structure
apps/backend/src/
  ├── products/     # Product feature
  ├── users/        # User management
  └── auth/         # Authentication
```

### 2. Read the Documentation

Start with these guides in order:

1. [Architecture Overview](docs/00-architecture.md) - Understand the system
2. [Frontend Guide](docs/01-frontend.md) - Learn React & Next.js
3. [Backend Guide](docs/02-backend.md) - Learn NestJS patterns
4. [Database Guide](docs/03-database.md) - Database design
5. [Docker Guide](docs/04-docker.md) - Containerization

### 3. Try Making Changes

**Easy First Changes:**

1. **Modify the home page:**
   - Edit: `apps/frontend/src/app/page.tsx`
   - Changes hot-reload instantly

2. **Add a new product field:**
   - Edit: `apps/backend/src/products/product.entity.ts`
   - Restart backend to see changes

3. **Style a component:**
   - Edit: `apps/frontend/src/components/ProductCard.tsx`
   - Try changing Tailwind classes

### 4. Work Through Exercises

Each documentation file has exercises at the bottom:
- **Beginner**: Start here
- **Intermediate**: After understanding basics
- **Advanced**: When comfortable with the stack

## Learning Path

### Week 1: Fundamentals
- ✅ Get project running
- ✅ Read architecture docs
- ✅ Understand file structure
- ✅ Make simple changes
- ✅ Complete beginner exercises

### Week 2-3: Core Features
- 📚 Study TypeScript patterns
- 🎨 Build React components
- 🔧 Create API endpoints
- 💾 Work with database
- ✏️ Complete intermediate exercises

### Week 4+: Advanced Topics
- 🔐 Implement authentication
- 🛒 Build shopping cart
- 📦 Add order management
- 🧪 Write tests
- 🚀 Deploy to cloud

## Common Issues

### Port 3000/3001 already in use

```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

### Docker won't start

```bash
# Make sure Docker Desktop is running
# Check: docker ps

# Reset everything
make docker-clean
make docker-up
```

### Changes not showing

```bash
# For Docker:
make docker-restart

# For local:
# Stop (Ctrl+C) and restart
make dev
```

### Database connection error

```bash
# Reset database
make db-reset

# Or check if postgres is running
docker ps | grep postgres
```

## Getting Help

### View Available Commands

```bash
make help
```

### Check Logs

```bash
# All services
make docker-logs

# Or specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Issues

```bash
# Open database shell
make db-shell

# Check tables
\dt

# View products
SELECT * FROM products;
```

## Development Workflow

### Daily Routine

```bash
# Morning: Start services
make docker-up

# Work on features
# Edit files → Save → Auto-reload

# Check logs if issues
make docker-logs

# Evening: Stop services
make docker-down
```

### Making Changes

1. **Frontend changes:**
   - Edit files in `apps/frontend/src/`
   - Changes appear instantly

2. **Backend changes:**
   - Edit files in `apps/backend/src/`
   - Auto-restarts on save

3. **Database changes:**
   - Edit entities in `apps/backend/src/*/*.entity.ts`
   - Restart backend for schema sync

### Testing Your Changes

```bash
# Run tests (when implemented)
make test

# Check code quality
make lint

# Build for production
make build
```

## What to Build First?

### Beginner Projects
1. Add product categories page
2. Create a search feature
3. Build a simple filter UI

### Intermediate Projects
1. User authentication system
2. Shopping cart functionality
3. Product reviews

### Advanced Projects
1. Payment integration
2. Real-time notifications
3. Admin dashboard

## Resources

### Official Docs
- [Next.js](https://nextjs.org/docs)
- [NestJS](https://docs.nestjs.com)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Docker](https://docs.docker.com)

### Learning Platforms
- [Next.js Learn](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [NestJS Discord](https://discord.gg/nestjs)

---

## Ready to Start?

```bash
# Clone the project
git clone <repo-url>
cd ecommerce-js

# Start services
make docker-up

# Open browser
open http://localhost:3000

# Start learning! 🚀
```

**Pro Tip:** Keep the [README.md](README.md) and docs open in your browser while coding. They're your reference guide!

Happy learning! Remember: start simple, experiment often, and build progressively. 🎉
