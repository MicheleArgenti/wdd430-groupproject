'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <header className="header">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-full">
            <span className="text-white font-bold text-xl">HH</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Handcrafted Haven</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-gray-700 hover:text-primary-600 transition">
            Shop
          </Link>
          <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition">
            Categories
          </Link>
          {user?.role === 'seller' && (
            <Link href="/dashboard/seller" className="text-gray-700 hover:text-primary-600 transition">
              Seller Dashboard
            </Link>
          )}
          <Link href="/about" className="text-gray-700 hover:text-primary-600 transition">
            About
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition">
            <span className="sr-only">Cart</span>
            🛒
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-gray-700 hover:text-primary-600 transition">
                {user.name}
              </Link>
              <button
                onClick={() => signOut()}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}