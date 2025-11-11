export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to E-Commerce Learning Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A progressive e-commerce application for learning React, TypeScript, Next.js, and NestJS
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Browse Products
          </a>
          <a
            href="/docs"
            className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition"
          >
            View Documentation
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Phase 1: Basics</h3>
          <p className="text-gray-600">
            Learn the fundamentals of React, TypeScript, and component architecture
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Component structure</li>
            <li>• State management</li>
            <li>• API integration</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Phase 2: Intermediate</h3>
          <p className="text-gray-600">
            Implement authentication, data fetching, and advanced patterns
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• User authentication</li>
            <li>• Server-side rendering</li>
            <li>• Database integration</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Phase 3: Enterprise</h3>
          <p className="text-gray-600">
            Scale to enterprise architecture with cloud, CI/CD, and AI features
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Microservices</li>
            <li>• Cloud deployment</li>
            <li>• AI integration</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
