import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { config } from "./lib/config";

// Initialize theme from config
document.addEventListener('DOMContentLoaded', function() {
  // Set initial theme based on config and saved preference
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme based on saved preference or system preference
  if (config.enableDarkMode && (isDarkMode || (prefersDarkMode && isDarkMode !== false))) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
});

createRoot(document.getElementById("root")!).render(<App />);
