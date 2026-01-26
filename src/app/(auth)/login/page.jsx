'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Logo } from '@/components/Logo';

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
      if (data.role === 'admin') {
        if (redirect.startsWith('/admin')) {
          console.log('Redirecting to:', redirect);
          window.location.href = redirect;
        } else {
          console.log('Redirecting to /admin');
          window.location.href = '/admin';
        }
      } else if (data.role === 'publisher') {
        if (redirect.startsWith('/publisher')) {
          console.log('Redirecting to:', redirect);
          window.location.href = redirect;
        } else {
          console.log('Redirecting to /publisher');
          window.location.href = '/publisher';
        }
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
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" aria-label="Home" className="flex justify-center">
          <Logo className="h-20 w-auto" />
        </Link>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Admin Panel
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#66462C] sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#66462C] sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-[#66462C] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#8B6F47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66462C] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="h-20 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Admin Panel
          </h2>
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
