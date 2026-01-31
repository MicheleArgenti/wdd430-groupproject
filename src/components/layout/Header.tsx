'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">HH</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Handcrafted Haven</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-amber-600 transition">
              Shop
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-amber-600 transition">
              Categories
            </Link>
            {session?.user?.role === 'seller' && (
              <Link href="/dashboard/seller" className="text-gray-700 hover:text-amber-600 transition">
                Seller Dashboard
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition">
              <span className="sr-only">Cart</span>
              🛒
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-700 hover:text-amber-600 transition">
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-amber-600 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}