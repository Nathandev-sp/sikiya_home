'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import { Logo } from '@/components/Logo';
import { SlimLayout } from '@/components/SlimLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login to:', `${API_URL}/signin`);
      console.log('Email:', email);

      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      let data;
      try {
        data = await response.json();
        console.log('Response data:', { ...data, token: data.token ? '***' : null });
      } catch (parseError) {
        const text = await response.text();
        console.error('Failed to parse response:', text);
        setError(`Server error (${response.status}). Check console for details.`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        console.error('Login failed:', data);
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token);
        console.log('Token stored successfully');
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        console.log('Token verification - stored:', storedToken ? 'Yes' : 'No');
      } else {
        console.error('No token in response:', data);
        setError('No authentication token received from server');
        setLoading(false);
        return;
      }

      console.log('User role:', data.role);
      console.log('Redirect target:', redirect);

      // Small delay to ensure token is stored before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect based on role or redirect parameter
      if (data.role === 'admin' && redirect.startsWith('/admin')) {
        console.log('Redirecting to:', redirect);
        window.location.href = redirect; // Use window.location for full page reload
      } else if (data.role === 'admin') {
        console.log('Redirecting to /admin');
        window.location.href = '/admin'; // Use window.location for full page reload
      } else {
        console.log('Redirecting to:', redirect);
        router.push(redirect);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Network error: ${err.message}. Make sure the backend is running on ${API_URL}`);
      setLoading(false);
    }
  }

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-24 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[#66462C] hover:underline"
        >
          Sign up
        </Link>{' '}
        for a free trial.
      </p>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <div>
          <Button 
            type="submit" 
            variant="solid" 
            color="blue" 
            className="w-full"
            disabled={loading}
          >
            <span>
              {loading ? 'Signing in...' : 'Sign in'}{' '}
              {!loading && <span aria-hidden="true">&rarr;</span>}
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <SlimLayout>
        <div className="flex">
          <Link href="/" aria-label="Home">
            <Logo className="h-24 w-auto" />
          </Link>
        </div>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-sm text-gray-700">Please wait while we load the login page.</p>
        </div>
      </SlimLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}
