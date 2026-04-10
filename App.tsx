import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebaseConfig';
import Routes from './src/routes';
import { useTracking } from './src/hooks/useTracking';

const queryClient = new QueryClient();

function AppWithTracking() {
  useTracking();
  return <Routes />;
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return isAuthenticated ? <AppWithTracking /> : <Routes />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}