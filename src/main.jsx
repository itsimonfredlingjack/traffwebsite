import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './theme.css';

const container = document.getElementById('root');
if (container && container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else if (container) {
  createRoot(container).render(<App />);
}
