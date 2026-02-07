'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from './LoginForm';

// Wrap the component that uses useSearchParams in Suspense
function LoginContent() {
  const router = useRouter();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm router={router} />
    </Suspense>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}