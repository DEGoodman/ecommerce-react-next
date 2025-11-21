.PHONY: help install dev build clean docker-up docker-down docker-logs docker-clean db-migrate db-seed test crawl walk-run

# Default target
help:
	@echo "E-Commerce Learning Platform - Available Commands"
	@echo ""
	@echo "Learning Phases:"
	@echo "  make crawl            - Start CRAWL phase (React + Vite + Express)"
	@echo "  make walk-run         - Start WALK/RUN phase (Next.js + NestJS)"
	@echo ""
	@echo "Installation & Setup:"
	@echo "  make install          - Install all dependencies"
	@echo "  make setup            - First-time setup (install + docker)"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Run all services locally (requires pnpm)"
	@echo "  make dev-frontend     - Run only frontend"
	@echo "  make dev-backend      - Run only backend"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-up        - Start all services with Docker"
	@echo "  make docker-down      - Stop all Docker services"
	@echo "  make docker-logs      - View Docker logs"
	@echo "  make docker-restart   - Restart Docker services"
	@echo "  make docker-clean     - Remove Docker containers and volumes"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell         - Open PostgreSQL shell"
	@echo "  make db-reset         - Reset database"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test             - Run all tests"
	@echo "  make lint             - Run linters"
	@echo "  make format           - Format code"
	@echo ""
	@echo "Build & Clean:"
	@echo "  make build            - Build all projects"
	@echo "  make clean            - Clean all build artifacts"

# Learning Phases
crawl:
	@echo "🐛 Starting CRAWL phase (React + Vite + Express)..."
	cd apps/crawl && docker compose up
	@echo "✅ CRAWL services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:3001"

crawl-down:
	@echo "🛑 Stopping CRAWL services..."
	cd apps/crawl && docker compose down

walk-run:
	@echo "🏃 Starting WALK/RUN phase (Next.js + NestJS)..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:3001"

# Installation
install:
	@echo "📦 Installing dependencies..."
	pnpm install

setup: install docker-up
	@echo "✅ Setup complete! Run 'make dev' or 'make docker-up'"

# Development (local)
dev:
	@echo "🚀 Starting all services locally..."
	pnpm run dev

dev-frontend:
	@echo "🎨 Starting frontend..."
	pnpm --filter @ecommerce/frontend dev

dev-backend:
	@echo "⚙️  Starting backend..."
	pnpm --filter @ecommerce/backend dev

# Docker commands
docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:3001"
	@echo "   Database: localhost:5432"

docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f

docker-restart: docker-down docker-up

docker-clean:
	@echo "🧹 Cleaning Docker resources..."
	docker-compose down -v
	docker system prune -f

# Database
db-shell:
	@echo "🗄️  Opening PostgreSQL shell..."
	docker-compose exec postgres psql -U postgres -d ecommerce

db-reset:
	@echo "⚠️  Resetting database..."
	docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS ecommerce;"
	docker-compose exec postgres psql -U postgres -c "CREATE DATABASE ecommerce;"
	@echo "✅ Database reset complete"

# Testing
test:
	@echo "🧪 Running tests..."
	pnpm run test

lint:
	@echo "🔍 Running linters..."
	pnpm run lint

format:
	@echo "✨ Formatting code..."
	pnpm --filter @ecommerce/backend format

# Build
build:
	@echo "🏗️  Building all projects..."
	pnpm run build

# Clean
clean:
	@echo "🧹 Cleaning build artifacts..."
	pnpm run clean
	rm -rf .next dist
