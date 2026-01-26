import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook to automatically log out users after a period of inactivity
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 30 minutes)
 * @param {string} redirectPath - Path to redirect to after logout (default: /login)
 */
export function useInactivityLogout(timeout = 30 * 60 * 1000, redirectPath = '/login') {
  const router = useRouter();
  const timeoutRef = useRef(null);

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Redirect to login
    router.push(redirectPath);
  };

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeout);
  };

  useEffect(() => {
    // List of events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup function
    return () => {
      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout, redirectPath]);
}
