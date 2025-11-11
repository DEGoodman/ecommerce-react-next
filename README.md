# E-Commerce Learning Platform

A comprehensive, progressively complex e-commerce application designed for learning and mastering React, TypeScript, Next.js, and NestJS. This project serves both as documentation for study and as an interactive development environment.

## Project Philosophy

This project starts with the simplest implementations and progressively scales to enterprise-grade architecture, including:
- Basic CRUD operations → Advanced state management
- Simple API calls → GraphQL and real-time subscriptions
- Local development → Cloud-native microservices
- Manual testing → Comprehensive CI/CD pipelines
- Basic features → AI-powered recommendations and search

## Quick Start

### Prerequisites
- Node.js 18+ (use nvm: `nvm use`)
- pnpm 8+ (`npm install -g pnpm`)
- Docker & Docker Compose (for containerized development)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-js

# Install dependencies
make install

# Start services with Docker (recommended)
make docker-up

# OR run locally
make dev
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/api/health

## Project Structure

```
ecommerce-js/
├── apps/
│   ├── frontend/          # Next.js 14 application
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── lib/       # Utilities & API client
│   │   │   └── types/     # TypeScript definitions
│   │   └── Dockerfile
│   └── backend/           # NestJS application
│       ├── src/
│       │   ├── products/  # Product module
│       │   ├── users/     # User module
│       │   ├── auth/      # Authentication
│       │   ├── cart/      # Shopping cart
│       │   └── orders/    # Order management
│       └── Dockerfile
├── packages/              # Shared packages (future)
├── docs/                  # Learning documentation
├── docker-compose.yml     # Multi-container setup
├── Makefile              # Development commands
└── README.md
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **React Query** - Server state management

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational database
- **Passport & JWT** - Authentication
- **Class Validator** - DTO validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pnpm** - Fast, disk-efficient package manager
- **Makefile** - Task automation

## Learning Roadmap

### Phase 1: Fundamentals (Current)
*Status: ✅ Implemented*

**Concepts Covered:**
- [x] Monorepo setup with workspaces
- [x] TypeScript configuration
- [x] Next.js App Router
- [x] NestJS modules & dependency injection
- [x] RESTful API design
- [x] Database entities with TypeORM
- [x] Docker containerization
- [x] Environment configuration

**What to Learn:**
1. **React & Next.js Basics**
   - Component structure (see: `apps/frontend/src/components/ProductCard.tsx`)
   - Server vs Client Components
   - App Router navigation
   - Styling with Tailwind CSS

2. **NestJS Architecture**
   - Controllers (HTTP endpoints)
   - Services (business logic)
   - Modules (feature organization)
   - DTOs (data validation)
   - See: `apps/backend/src/products/`

3. **TypeScript**
   - Interface definitions (`apps/frontend/src/types/index.ts`)
   - Type-safe API calls
   - Generics and utility types

4. **Database with TypeORM**
   - Entity definitions
   - Repository pattern
   - Migrations (upcoming)

**Exercises:**
- [ ] Add a new field to Product entity
- [ ] Create a new component for displaying categories
- [ ] Add filtering by price range
- [ ] Implement pagination for products

### Phase 2: Intermediate Features (Next Steps)
*Status: 🚧 Planned*

**Features to Implement:**
- [ ] User authentication with JWT
- [ ] Protected routes and route guards
- [ ] Shopping cart with session management
- [ ] Checkout flow
- [ ] Order history
- [ ] Image upload and management
- [ ] Search functionality
- [ ] Advanced filtering & sorting

**Concepts to Learn:**
- JWT authentication flow
- State management with Zustand
- Form handling with React Hook Form
- File uploads
- Error handling & loading states
- Optimistic updates
- Server-side rendering strategies

**Documentation to Read:**
- `docs/02-authentication.md` (to be created)
- `docs/03-state-management.md` (to be created)

### Phase 3: Advanced Patterns (Future)
*Status: 📋 Planned*

**Features:**
- [ ] Real-time notifications with WebSockets
- [ ] Payment integration (Stripe)
- [ ] Advanced caching strategies
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Event-driven patterns
- [ ] CQRS implementation

**Concepts:**
- WebSocket communication
- Event sourcing
- Message queues (RabbitMQ/Redis)
- API Gateway pattern
- Service mesh

### Phase 4: Enterprise & Scale (Advanced)
*Status: 📋 Planned*

**Features:**
- [ ] Kubernetes deployment
- [ ] CI/CD pipelines (GitHub Actions)
- [ ] Monitoring & logging (Prometheus/Grafana)
- [ ] Performance optimization
- [ ] Load balancing
- [ ] Database replication
- [ ] CDN integration
- [ ] Multi-region deployment

**Concepts:**
- Container orchestration
- Infrastructure as Code (Terraform)
- Observability
- Performance tuning
- Scalability patterns

### Phase 5: AI & Modern Features (Cutting Edge)
*Status: 📋 Planned*

**Features:**
- [ ] AI-powered product recommendations
- [ ] Semantic search with vector databases
- [ ] Chatbot customer support
- [ ] Image recognition for product search
- [ ] Dynamic pricing algorithms
- [ ] Fraud detection

**Concepts:**
- OpenAI API integration
- Vector embeddings
- Machine learning model integration
- Real-time AI inference

## Development Commands

```bash
# View all available commands
make help

# Development
make dev              # Run all services locally
make dev-frontend     # Run only frontend
make dev-backend      # Run only backend

# Docker
make docker-up        # Start all services with Docker
make docker-down      # Stop all services
make docker-logs      # View logs
make docker-clean     # Clean up containers and volumes

# Database
make db-shell         # Open PostgreSQL shell
make db-reset         # Reset database

# Testing & Quality
make test             # Run tests
make lint             # Run linters
make format           # Format code

# Build
make build            # Build production bundles
make clean            # Clean build artifacts
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products?category=electronics` - Filter by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Health Check
- `GET /api/health` - Service health status

### Coming Soon
- Authentication (`/api/auth/*`)
- Cart management (`/api/cart/*`)
- Order management (`/api/orders/*`)

## Documentation

Detailed learning guides are available in the `docs/` directory:

- [Architecture Overview](docs/00-architecture.md)
- [Frontend Guide](docs/01-frontend.md)
- [Backend Guide](docs/02-backend.md)
- [Database Design](docs/03-database.md)
- [Docker & Deployment](docs/04-docker.md)

## Best Practices Demonstrated

### Code Organization
- Feature-based module structure
- Separation of concerns
- Dependency injection
- Repository pattern

### Type Safety
- End-to-end TypeScript
- Shared type definitions
- DTO validation
- API response typing

### Development Experience
- Hot module reloading
- Docker for consistent environments
- Makefile for common tasks
- Clear error messages

### Security
- Environment variable management
- Password hashing (bcrypt)
- SQL injection prevention (TypeORM)
- CORS configuration

## Troubleshooting

### Port conflicts
If ports 3000, 3001, or 5432 are in use:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

### Database connection issues
```bash
# Reset the database
make db-reset

# Or restart Docker services
make docker-restart
```

### Dependencies issues
```bash
# Clean and reinstall
make clean
pnpm install
```

## Contributing

This is a learning project! Feel free to:
1. Experiment with the code
2. Add new features
3. Improve documentation
4. Share your learnings

## Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeORM Guide](https://typeorm.io)
- [React Docs](https://react.dev)

### Learning Paths
- [Next.js Learn](https://nextjs.org/learn)
- [NestJS Courses](https://courses.nestjs.com)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## License

MIT - This is a learning project, feel free to use it however you'd like!

---

**Happy Learning! 🚀**

Start with Phase 1 exercises and gradually work your way up. Remember: the best way to learn is by building!
