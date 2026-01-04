'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { SlimLayout } from '@/components/SlimLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid reset link. Please request a new password reset.');
        setValidating(false);
        setTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/validate-reset-token/${token}`);
        const data = await response.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setError(data.error || 'Invalid or expired reset token. Please request a new password reset.');
          setTokenValid(false);
        }
      } catch (err) {
        console.error('Error validating token:', err);
        setError('Failed to validate reset token. Please try again.');
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please enter both password fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password. Please try again.');
        setLoading(false);
        return;
      }

      // Success - redirect to login
      alert('Password reset successfully! You can now login with your new password.');
      router.push('/login');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(`Network error: ${err.message}. Please try again.`);
      setLoading(false);
    }
  }

  // Show loading state while validating token
  if (validating) {
    return (
      <SlimLayout>
        <div className="flex">
          <Link href="/" aria-label="Home">
            <Logo className="h-24 w-auto" />
          </Link>
        </div>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">Validating reset link...</h2>
          <p className="mt-2 text-sm text-gray-700">Please wait while we verify your reset link.</p>
        </div>
      </SlimLayout>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <SlimLayout>
        <div className="flex">
          <Link href="/" aria-label="Home">
            <Logo className="h-24 w-auto" />
          </Link>
        </div>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">Invalid Reset Link</h2>
          <p className="mt-2 text-sm text-gray-700">
            {error || 'This password reset link is invalid or has expired. Please request a new password reset.'}
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="font-medium text-[#66462C] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </SlimLayout>
    );
  }

  // Show reset password form
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-24 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Reset Your Password
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Enter your new password below. Make sure it's at least 8 characters long.
      </p>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        {/* Password Field with Show/Hide Toggle */}
        <div>
          <label htmlFor="password" className="mb-3 block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-[#66462C] focus:bg-white focus:outline-hidden focus:ring-[#66462C] sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field with Show/Hide Toggle */}
        <div>
          <label htmlFor="confirmPassword" className="mb-3 block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-[#66462C] focus:bg-white focus:outline-hidden focus:ring-[#66462C] sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <Button 
            type="submit" 
            variant="solid" 
            color="blue" 
            className="w-full"
            disabled={loading}
          >
            <span>
              {loading ? 'Resetting Password...' : 'Reset Password'}{' '}
              {!loading && <span aria-hidden="true">&rarr;</span>}
            </span>
          </Button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-[#66462C] hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </SlimLayout>
  );
}

