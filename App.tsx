import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Routes from './src/routes';
import { useTracking } from './src/hooks/useTracking';

const queryClient = new QueryClient();

function AppWithTracking() {
  useTracking();
  return <Routes />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithTracking />
    </QueryClientProvider>
  );
}