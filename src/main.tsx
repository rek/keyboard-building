import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './router';
import { UserChoicesProvider } from './contexts/UserChoicesContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import './styles.css';

// Handle GitHub Pages 404 redirect
(function() {
  const redirect = sessionStorage.getItem('redirect');
  const redirectSearch = sessionStorage.getItem('redirectSearch');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    sessionStorage.removeItem('redirectSearch');
    const path = redirect + (redirectSearch || '');
    // Update the URL without triggering a navigation
    history.replaceState(null, '', path);
  }
})();

const router = getRouter();

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppSettingsProvider>
      <CurrencyProvider>
        <UserChoicesProvider>
          <RouterProvider router={router} />
        </UserChoicesProvider>
      </CurrencyProvider>
    </AppSettingsProvider>
  </React.StrictMode>
);
