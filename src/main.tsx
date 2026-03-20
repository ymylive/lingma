import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { detectPreferredLocale, ensureLocaleResources } from './i18n';
import './index.css';

const initialLocale = detectPreferredLocale();
if (initialLocale === 'en-US') {
  await ensureLocaleResources(initialLocale);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
