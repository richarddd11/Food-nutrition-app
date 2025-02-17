import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

const base = import.meta.env.MODE === 'production' ? '/Food-nutrition-app' : '/';

createRoot(document.getElementById('root')).render(
  <HashRouter basename={base}>
    <App />
  </HashRouter>
  
)
