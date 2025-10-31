import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeUIProvider } from 'theme-ui';
import { DefaultTheme } from './theme';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeUIProvider theme={DefaultTheme}>
      <App />
    </ThemeUIProvider>
  </StrictMode>
);
