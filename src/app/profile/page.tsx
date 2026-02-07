'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {user?.name || 'Not set'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {user?.email || 'Not set'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === 'seller' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role === 'seller' ? 'Seller Account' : 'Buyer Account'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Change Password
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Update Email
                </button>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left p-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-amber-600">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'seller' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role === 'seller' ? 'Seller' : 'Buyer'}
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/orders" className="block p-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded">
                  My Orders
                </a>
                {user?.role === 'seller' && (
                  <a href="/dashboard/seller" className="block p-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded">
                    Seller Dashboard
                  </a>
                )}
                <a href="/wishlist" className="block p-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded">
                  Wishlist
                </a>
                <a href="/settings" className="block p-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded">
                  Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}