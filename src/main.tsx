import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Set light mode as default
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light');
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
