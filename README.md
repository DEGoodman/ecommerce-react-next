# E-Commerce Learning Platform: Crawl-Walk-Run

A progressive e-commerce application designed to take you from React/TypeScript fundamentals all the way to enterprise-grade architecture with NestJS. Learn by building a real-world application with Docker from day one.

## 🎯 What Makes This Different?

This isn't just another tutorial. It's a **complete learning journey** structured around the "crawl-walk-run" methodology:

- **🐛 CRAWL**: Master React and TypeScript fundamentals with a simple, working e-commerce site
- **🚶 WALK**: Add production patterns, Next.js, authentication, and better architecture
- **🏃 RUN**: Build enterprise-grade systems with NestJS, microservices, and GraphQL
- **🚀 OPTIMIZE**: Learn performance techniques used by the best (McMaster-Carr, Amazon, etc.)

### Key Features
✅ **Docker from Day One** - All phases use containers
✅ **Progressive Complexity** - Start simple, scale to enterprise
✅ **Real-World Patterns** - Industry-standard practices
✅ **Performance Focus** - Optimization techniques from top e-commerce sites
✅ **Comprehensive Docs** - Deep-dive guides for every concept

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (`nvm use`)
- pnpm 8+ (`npm install -g pnpm`)
- Docker & Docker Compose

### Get Started in 3 Steps

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd ecommerce-learning-platform

# 2. Install dependencies
pnpm install

# 3. Start with Docker (recommended)
docker-compose up
```

Visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Health**: http://localhost:3001/api/health

---

## 📚 Learning Path

### Choose Your Starting Point

<table>
<tr>
<td width="25%">

### 🐛 **CRAWL**
*2-4 weeks*

**For:** Beginners

**Learn:**
- React basics
- TypeScript
- Simple APIs
- Docker basics

**Build:**
- Product listing
- Shopping cart
- Basic backend

[Start Here →](docs/phases/01-crawl.md)

</td>
<td width="25%">

### 🚶 **WALK**
*3-6 weeks*

**For:** Intermediate

**Learn:**
- Next.js 14
- Authentication
- State management
- Testing

**Build:**
- User auth
- Checkout flow
- Search
- Order history

[Continue →](docs/phases/02-walk.md)

</td>
<td width="25%">

### 🏃 **RUN**
*4-8 weeks*

**For:** Advanced

**Learn:**
- NestJS
- Microservices
- GraphQL
- Event-driven

**Build:**
- Microservices
- Real-time features
- Payment integration
- Admin dashboard

[Advance →](docs/phases/03-run.md)

</td>
<td width="25%">

### 🚀 **OPTIMIZE**
*Ongoing*

**For:** Everyone

**Learn:**
- Performance tuning
- Caching strategies
- CDN setup
- Monitoring

**Achieve:**
- Lighthouse 95+
- Sub-second loads
- Scale to millions
- Zero downtime

[Optimize →](docs/phases/04-optimize.md)

</td>
</tr>
</table>

**📖 [Complete Learning Path Guide](CRAWL-WALK-RUN.md)**

---

## 🏗️ Project Structure

```
ecommerce-learning-platform/
├── apps/
│   ├── crawl/             # CRAWL phase (React + Vite + Express)
│   │   ├── frontend/      # React 18 + TypeScript
│   │   ├── backend/       # Express.js + TypeScript
│   │   └── docker-compose.yml
│   ├── frontend/          # WALK/RUN phase - Next.js 14
│   └── backend/           # WALK/RUN phase - NestJS
├── docs/
│   ├── phases/            # Phase-specific guides
│   │   ├── 01-crawl.md
│   │   ├── 02-walk.md
│   │   ├── 03-run.md
│   │   └── 04-optimize.md
│   ├── 00-architecture.md
│   ├── 01-frontend.md
│   ├── 02-backend.md
│   ├── 03-database.md
│   └── 04-docker.md
├── CRAWL-WALK-RUN.md      # Complete learning guide
├── docker-compose.yml     # WALK/RUN multi-container setup
└── Makefile              # Development commands
```

---

## 🛠️ Technology Stack

### CRAWL Phase
- React 18 + TypeScript + Vite
- Express.js or JSON Server
- PostgreSQL (Docker)
- Plain CSS or Tailwind

### WALK Phase
- Next.js 14 + TypeScript
- Express.js (structured)
- PostgreSQL + Prisma
- Zustand/Redux
- NextAuth.js

### RUN Phase
- Next.js 14 (advanced)
- NestJS + Microservices
- PostgreSQL + Redis + MongoDB
- GraphQL + WebSockets
- RabbitMQ
- Elasticsearch

### OPTIMIZE Phase
- All of the above + Performance monitoring
- CDN (CloudFront/Cloudflare)
- Prometheus + Grafana
- Real User Monitoring

---

## 🎓 Learning Outcomes by Phase

### After CRAWL, you'll understand:
✅ React component composition
✅ TypeScript type safety
✅ State management basics
✅ REST API fundamentals
✅ Docker containerization

### After WALK, you'll understand:
✅ Next.js App Router & Server Components
✅ Authentication & authorization flows
✅ Advanced state management
✅ Form validation patterns
✅ Testing strategies

### After RUN, you'll understand:
✅ NestJS architecture & DI
✅ Microservices communication
✅ Event-driven architecture
✅ GraphQL API design
✅ Production deployment

### After OPTIMIZE, you'll understand:
✅ Performance optimization techniques
✅ Caching strategies (multi-layer)
✅ CDN configuration
✅ Monitoring & observability
✅ Real-world scale challenges

---

## 💻 Development Commands

```bash
# View all commands
make help

# Learning Phases
make crawl            # Start CRAWL phase (React + Vite + Express)
make walk-run         # Start WALK/RUN phase (Next.js + NestJS)

# Docker (recommended)
make docker-up        # Start all services
make docker-down      # Stop all services
make docker-logs      # View logs
make docker-restart   # Restart services
make docker-clean     # Clean containers & volumes

# Database
make db-shell         # PostgreSQL shell
make db-reset         # Reset database

# Quality
make test             # Run tests
make lint             # Run linters
make format           # Format code

# Build
make build            # Production build
make clean            # Clean artifacts
```

---

## 🌟 Why McMaster-Carr Inspired?

McMaster-Carr runs one of the fastest, most efficient e-commerce sites on the internet. Their techniques include:

- ⚡ **Minimal JavaScript** - Site works without JS
- 🎯 **Server-side rendering** - Instant page loads
- 💾 **Aggressive caching** - Smart cache strategies
- 🖼️ **Optimized images** - Right size, modern formats
- 🔍 **Lightning-fast search** - Sub-50ms responses

**The OPTIMIZE phase** teaches you these techniques and more, showing you how to build world-class performance into your applications.

[Read the McMaster-Carr Case Study →](docs/phases/04-optimize-mcmaster.md)

---

## 📖 Documentation

### Getting Started
- [Quick Start Guide](QUICKSTART.md)
- [Complete Crawl-Walk-Run Guide](CRAWL-WALK-RUN.md)

### Architecture & Concepts
- [Architecture Overview](docs/00-architecture.md)
- [Frontend Guide](docs/01-frontend.md)
- [Backend Guide](docs/02-backend.md)
- [Database Design](docs/03-database.md)
- [Docker & Deployment](docs/04-docker.md)

### Phase Guides
- [Phase 1: CRAWL - React Fundamentals](docs/phases/01-crawl.md)
- [Phase 2: WALK - Production Patterns](docs/phases/02-walk.md)
- [Phase 3: RUN - Enterprise Architecture](docs/phases/03-run.md)
- [Phase 4: OPTIMIZE - Performance](docs/phases/04-optimize.md)

---

## 🎯 Your First Steps

### Complete Beginner?
1. Read [CRAWL-WALK-RUN.md](CRAWL-WALK-RUN.md) to understand the journey
2. Start with [CRAWL Phase Guide](docs/phases/01-crawl.md)
3. Build the product listing feature
4. Don't skip ahead - master fundamentals first

### Some Experience?
1. Quick review of CRAWL concepts
2. Jump into [WALK Phase](docs/phases/02-walk.md)
3. Focus on patterns you haven't used
4. Build real features, not just tutorials

### Experienced Developer?
1. Skim CRAWL & WALK
2. Deep dive into [RUN Phase](docs/phases/03-run.md)
3. Study microservices architecture
4. Focus on [OPTIMIZE Phase](docs/phases/04-optimize.md)

---

## 🔥 Current Features

### Implemented (RUN Phase Preview)
- ✅ Product CRUD operations
- ✅ RESTful API with NestJS
- ✅ PostgreSQL database with TypeORM
- ✅ Next.js 14 frontend
- ✅ Docker containerization
- ✅ TypeScript end-to-end

### Coming in WALK Phase
- 🚧 User authentication (JWT)
- 🚧 Shopping cart persistence
- 🚧 Checkout flow
- 🚧 Order management
- 🚧 Product search
- 🚧 Image uploads

### Coming in RUN Phase
- 📋 Microservices architecture
- 📋 GraphQL API
- 📋 Real-time features (WebSockets)
- 📋 Payment integration
- 📋 Event-driven patterns
- 📋 Advanced caching

### Coming in OPTIMIZE Phase
- 📋 Performance monitoring
- 📋 CDN integration
- 📋 Image optimization
- 📋 Search optimization
- 📋 Lighthouse 95+ score
- 📋 Load testing & tuning

---

## 🤝 Contributing & Learning Together

This is a learning project! Feel free to:
- Experiment and break things
- Add new features beyond the curriculum
- Improve documentation
- Share your learnings
- Ask questions in issues

---

## 🤖 Using Claude for Learning

This project is designed for **interactive learning with Claude**. Just describe what you want to learn:

```
"Claude, help me understand React hooks in the CRAWL phase"
"Explain how the Next.js App Router works"
"Walk me through the NestJS backend structure"
```

Claude can:
- Guide you through each phase
- Explain concepts with examples
- Review your code and provide feedback
- Help debug issues
- Discuss architectural decisions

---

## 📚 External Resources

### Official Documentation
- [React Docs](https://react.dev) - Modern React documentation
- [Next.js Docs](https://nextjs.org/docs) - Next.js 14 App Router
- [NestJS Docs](https://docs.nestjs.com) - NestJS framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [TypeORM Guide](https://typeorm.io) - Database ORM

### Learning Paths
- [Next.js Learn](https://nextjs.org/learn) - Interactive tutorial
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - TS book
- [React Testing Library](https://testing-library.com/react) - Testing guide

### Performance
- [web.dev](https://web.dev) - Google's web performance guides
- [Core Web Vitals](https://web.dev/vitals/) - Performance metrics
- [McMaster-Carr](https://www.mcmaster.com) - Study this site's performance!

---

## 📊 Progress Tracking

Track your progress through the phases:

```bash
# Check which phase you're on
cat .learning-progress

# Mark phase as complete
echo "CRAWL_COMPLETE=true" >> .learning-progress
```

Or use the built-in tracking in each phase's documentation.

---

## 🎓 Learning Philosophy

> "Make it work, make it right, make it fast - in that order." — Kent Beck

- **CRAWL = Make it work** (functionality first)
- **WALK = Make it right** (patterns and architecture)
- **RUN = Make it enterprise** (scale and advanced features)
- **OPTIMIZE = Make it fast** (performance and efficiency)

---

## 🚀 Ready to Start?

1. **Read this README** ✅ (you're here!)
2. **Read [CRAWL-WALK-RUN.md](CRAWL-WALK-RUN.md)** to understand the full journey
3. **Choose your phase** based on your experience
4. **Start building** and learning by doing
5. **Track your progress** with the checklists
6. **Share your learnings** with the community

---

## 📞 Getting Help

- **Documentation**: Check `docs/` directory first
- **Issues**: Open a GitHub issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions

---

## 📄 License

MIT - This is a learning project, feel free to use it however you'd like!

---

<div align="center">

**🎯 Start Your Journey: [CRAWL-WALK-RUN.md](CRAWL-WALK-RUN.md)**

Master e-commerce development from fundamentals to enterprise-grade architecture.

**Happy Learning! 🚀**

</div>
