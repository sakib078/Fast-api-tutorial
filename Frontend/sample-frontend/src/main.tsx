import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element from the HTML
const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

// Create the React root and render the app
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);