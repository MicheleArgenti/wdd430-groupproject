'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    'CredentialsSignin': 'Invalid email or password',
    'default': 'An error occurred during authentication',
  };

  const errorMessage = errorMessages[error || 'default'] || errorMessages.default;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block text-gray-600 hover:text-amber-600 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}