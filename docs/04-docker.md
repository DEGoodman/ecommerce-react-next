# Docker & Deployment Guide

## Overview

This project uses Docker for containerization and Docker Compose for orchestrating multiple services. This ensures consistent development and deployment environments.

## Why Docker?

**Benefits:**
- ✅ Consistent environment across machines
- ✅ Isolated dependencies
- ✅ Easy setup (no manual installations)
- ✅ Production-like development
- ✅ Simple deployment

## Architecture

```
Docker Network: ecommerce-network
│
├── Frontend Container (Next.js)
│   ├── Port: 3000
│   ├── Hot reload enabled
│   └── Connects to Backend API
│
├── Backend Container (NestJS)
│   ├── Port: 3001
│   ├── Hot reload enabled
│   ├── Connects to PostgreSQL
│   └── Serves REST API
│
└── PostgreSQL Container
    ├── Port: 5432
    ├── Persistent volume
    └── Database: ecommerce
```

## Docker Compose Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./apps/backend
    ports:
      - '3001:3001'
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./apps/backend/src:/app/src

  frontend:
    build: ./apps/frontend
    ports:
      - '3000:3000'
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
    depends_on:
      - backend
    volumes:
      - ./apps/frontend/src:/app/src

volumes:
  postgres-data:
```

### Key Concepts

**Services:**
- Each service is a container
- Services can communicate by name
- `depends_on` ensures startup order

**Ports:**
- Format: `HOST:CONTAINER`
- `3000:3000` maps container port 3000 to host port 3000

**Volumes:**
- **Named volumes**: `postgres-data` (persistent)
- **Bind mounts**: `./src:/app/src` (for hot reload)

**Environment:**
- Set environment variables for containers
- Backend uses `postgres` as hostname (service name)

**Health Checks:**
- Ensures service is ready before dependents start
- Backend waits for PostgreSQL to be healthy

## Dockerfiles

### Backend Dockerfile

```dockerfile
FROM node:18-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

# Development stage
FROM base AS development

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "run", "dev"]

# Production stage
FROM base AS production

ENV NODE_ENV=production

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
```

**Multi-stage Build:**
1. **Base**: Common setup
2. **Development**: All dependencies + hot reload
3. **Production**: Only production dependencies + compiled code

**Benefits:**
- Smaller production images
- Faster builds (layer caching)
- Separate dev/prod configs

### Frontend Dockerfile

Similar structure with Next.js-specific commands:

```dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

FROM base AS development
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --prod
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["pnpm", "run", "start"]
```

## Common Commands

### Using Makefile (Recommended)

```bash
# View all commands
make help

# Start services
make docker-up

# Stop services
make docker-down

# View logs
make docker-logs

# Restart services
make docker-restart

# Clean up everything
make docker-clean

# Database shell
make db-shell
```

### Direct Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Rebuild containers
docker-compose up -d --build

# Stop and remove volumes
docker-compose down -v
```

### Individual Container Commands

```bash
# List running containers
docker ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U postgres

# View container logs
docker logs ecommerce-backend

# Restart specific service
docker-compose restart backend
```

## Development Workflow

### 1. Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd ecommerce-js

# Start services
make docker-up

# Wait for services to start (check logs)
make docker-logs
```

### 2. Daily Development

```bash
# Start containers (if not running)
make docker-up

# Make code changes
# Changes auto-reload (hot reload enabled)

# View logs if issues
make docker-logs

# Stop when done
make docker-down
```

### 3. Troubleshooting

```bash
# Rebuild after dependency changes
docker-compose up -d --build

# Reset database
make db-reset

# Clean everything and restart
make docker-clean
make docker-up

# Check container status
docker ps -a
```

## Volume Management

### Named Volumes

Persist data between container restarts:

```yaml
volumes:
  postgres-data:  # Database data persists
```

**Commands:**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect ecommerce-js_postgres-data

# Remove volume (deletes data!)
docker volume rm ecommerce-js_postgres-data
```

### Bind Mounts

Sync code for hot reload:

```yaml
volumes:
  - ./apps/backend/src:/app/src  # Local changes → Container
```

**Benefits:**
- Edit locally, run in container
- No need to rebuild on code changes
- Same editor/tools as usual

## Networking

### How Services Communicate

Containers on the same network can communicate by service name:

```typescript
// Frontend calls backend
const API_URL = 'http://backend:3001'

// Backend calls database
const DB_HOST = 'postgres'
```

**From Host:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- PostgreSQL: `localhost:5432`

**Between Containers:**
- Frontend → Backend: `http://backend:3001`
- Backend → PostgreSQL: `postgres:5432`

### Custom Networks

```yaml
networks:
  ecommerce-network:
    driver: bridge

services:
  backend:
    networks:
      - ecommerce-network
```

## Environment Variables

### Development

```yaml
# docker-compose.yml
environment:
  NODE_ENV: development
  DB_HOST: postgres
  DB_PORT: 5432
```

### Production

Use environment files:

```yaml
# docker-compose.prod.yml
services:
  backend:
    env_file:
      - .env.production
```

```bash
# .env.production
NODE_ENV=production
DB_HOST=prod-database.example.com
JWT_SECRET=super-secret-key
```

**Security:**
- Never commit `.env` files
- Use secrets management in production
- Environment-specific configs

## Building & Optimization

### Layer Caching

Docker caches layers for faster builds:

```dockerfile
# ✅ Good: Dependencies cached separately
COPY package*.json ./
RUN pnpm install
COPY . .

# ❌ Bad: Reinstalls on any file change
COPY . .
RUN pnpm install
```

### Multi-Stage Builds

```dockerfile
# Build stage
FROM node:18-alpine AS builder
COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine
COPY --from=builder /app/dist ./dist
```

**Benefits:**
- Smaller final images
- No dev dependencies in production
- Faster deployments

### Image Size Optimization

```dockerfile
# Use Alpine (smaller base)
FROM node:18-alpine

# Clean up after install
RUN pnpm install && pnpm store prune

# Use .dockerignore
# node_modules
# .git
# *.log
```

## Production Deployment

### Docker Compose (Simple)

```bash
# Production compose file
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Kubernetes (Enterprise)

Future: Orchestrate containers at scale

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    spec:
      containers:
      - name: backend
        image: ecommerce-backend:latest
        ports:
        - containerPort: 3001
```

## Monitoring & Logs

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Since timestamp
docker-compose logs --since 2024-01-01T10:00:00
```

### Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Common Issues & Solutions

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - '3001:3000'  # Map to different host port
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check if previous container is running
docker ps -a

# Remove old containers
docker-compose down
docker-compose up -d
```

### Database Connection Failed

```bash
# Check if postgres is healthy
docker-compose ps

# Wait for health check
# The backend depends on postgres being healthy

# Reset database
make db-reset
```

### Hot Reload Not Working

```bash
# Ensure volume is mounted
docker-compose exec backend ls -la /app/src

# Rebuild container
docker-compose up -d --build backend
```

## Best Practices

### 1. Use .dockerignore

```
node_modules
.git
.env
*.log
dist
.next
```

### 2. Specific Image Tags

```dockerfile
# ✅ Good
FROM node:18.17-alpine

# ❌ Bad (unpredictable)
FROM node:latest
```

### 3. Non-Root User

```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### 4. Health Checks

Always add health checks for critical services:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready"]
  interval: 10s
```

### 5. Resource Limits

Prevent containers from consuming all resources:

```yaml
deploy:
  resources:
    limits:
      memory: 512M
```

## Exercises

### Beginner
1. ✏️ Start all services with Docker
2. ✏️ View logs for each service
3. ✏️ Connect to PostgreSQL shell

### Intermediate
4. ✏️ Add Redis service to docker-compose
5. ✏️ Create production Dockerfile
6. ✏️ Add health check endpoint

### Advanced
7. ✏️ Optimize image size
8. ✏️ Set up multi-stage build
9. ✏️ Create Kubernetes manifests

## Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## Next Steps

- Understand the current setup
- Practice common commands
- Try the exercises
- Explore production deployment options
