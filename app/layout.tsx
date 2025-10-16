import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import "./globals.css";

export const metadata: Metadata = {
  title: "🛍️ Clothing Store",
  description: "A simple e-commerce app built with Next.js + Prisma",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "supersecret") as { id: string; email: string };
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse [animation-delay:700ms]"></div>
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link 
                href="/" 
                className="group flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">🛍️</span>
                <span className="hidden sm:inline">ClothingStore</span>
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {/* User Greeting */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
                      <span className="text-2xl inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
                      <span className="text-sm">
                        Hi, <span className="font-semibold text-blue-700">{user.email.split('@')[0]}</span>
                      </span>
                    </div>

                    {/* Add Product Button */}
                    <Link
                      href="/add-product"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium overflow-hidden hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Add Product</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </Link>

                    {/* Logout Button */}
                    <form action="/api/auth/logout" method="POST">
                      <button
                        type="submit"
                        className="group px-5 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden sm:inline">Logout</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <Link
                      href="/login"
                      className="group px-5 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </Link>

                    {/* Register Button */}
                    <Link
                      href="/register"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium overflow-hidden hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Register</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"></div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative backdrop-blur-xl bg-white/80 border-t border-gray-200/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">🛍️</span>
                <span className="text-sm">
                  © {new Date().getFullYear()} Clothing Store. All rights reserved.
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.176.943.11.78.89z"/>
                  </svg>
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}