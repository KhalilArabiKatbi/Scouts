'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
  // This is the HOC
  const AuthComponent = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Ensure localStorage is available (client-side only)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // TODO: Optionally verify token validity here with an API call
          // For now, presence of token means authenticated
          setIsAuthenticated(true);
        } else {
          router.replace('/login'); // Use replace to avoid login page in history
        }
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      // You can return a loading spinner or a blank page here
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
      // This case should ideally be handled by the redirect in useEffect,
      // but as a fallback or if redirect hasn't happened yet.
      return null; // Or a message, or let the redirect in useEffect handle it.
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for easier debugging in React DevTools
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
