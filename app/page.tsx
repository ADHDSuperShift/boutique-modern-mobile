import React from 'react';
import AppLayout from './components/AppLayout';
import { AppProvider } from './contexts/AppContext';

export default function Home() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
