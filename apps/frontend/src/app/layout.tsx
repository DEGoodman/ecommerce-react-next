import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Commerce Learning Platform',
  description: 'Progressive e-commerce application built with Next.js and NestJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-600">
                  E-Commerce Platform
                </h1>
                <div className="flex gap-4">
                  <a href="/" className="hover:text-primary-600">Home</a>
                  <a href="/products" className="hover:text-primary-600">Products</a>
                  <a href="/cart" className="hover:text-primary-600">Cart</a>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
              E-Commerce Learning Platform - Built with Next.js & NestJS
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
