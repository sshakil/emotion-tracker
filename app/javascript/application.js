import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (rootElement && window.location.pathname !== '/users/sign_in') {
    const root = createRoot(rootElement);
    root.render(<App />);
  } else {
    console.debug('Root element unnecessary for this page.');
  }
});