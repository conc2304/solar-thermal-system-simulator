import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeUIProvider } from 'theme-ui';

import App from './App';
import { DefaultTheme } from './theme';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeUIProvider theme={DefaultTheme}>
      <App />
    </ThemeUIProvider>
  </StrictMode>
);
