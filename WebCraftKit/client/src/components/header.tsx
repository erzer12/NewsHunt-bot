import { useState, useEffect } from "react";
import { TextPlaceholder } from "@/components/ui/text-placeholder";
import { config } from "@/lib/config";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { FunSpinner } from "@/components/ui/fun-spinner";

/**
 * Header Component
 * 
 * This component contains the site navigation, logo, and theme toggle.
 * It's responsive with a mobile menu for smaller screens.
 * 
 * CUSTOMIZATION OPTIONS:
 * 1. Edit company name and navigation items in the config.ts file
 * 2. Customize logo and branding colors in the theme.json file
 * 3. Add your own logo by replacing the letter in the circle with an image
 * 
 * DEVELOPER NOTES:
 * - The header automatically builds navigation from config.navigation array
 * - To change logo style, modify the div with className="w-10 h-10 rounded-full..."
 * - Dark mode toggle is controlled by config.features.darkMode
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [hoverEffect, setHoverEffect] = useState('underline'); // 'underline', 'scale', 'glow', 'tilt'
  const [spinnerType, setSpinnerType] = useState('pulse'); // For fun spinner types
  
  // Function to cycle through hover effects
  const cycleHoverEffect = () => {
    const effects = ['underline', 'scale', 'glow', 'tilt'];
    const currentIndex = effects.indexOf(hoverEffect);
    const nextIndex = (currentIndex + 1) % effects.length;
    setHoverEffect(effects[nextIndex]);
  };
  
  // Function to cycle through spinner types
  const cycleSpinnerType = () => {
    const types = ['pulse', 'dots', 'bounce', 'orbit', 'flip', 'grid', 'wave'];
    const currentIndex = types.indexOf(spinnerType);
    const nextIndex = (currentIndex + 1) % types.length;
    setSpinnerType(types[nextIndex]);
  };
  
  // Get the CSS class for the current hover effect
  const getHoverClass = () => {
    switch(hoverEffect) {
      case 'underline': return 'nav-hover-underline';
      case 'scale': return 'nav-hover-scale';
      case 'glow': return 'nav-hover-glow';
      case 'tilt': return 'nav-hover-tilt';
      default: return 'nav-hover-underline';
    }
  };

  // Extract first letter of company name for the logo
  const logoLetter = config.companyName.charAt(0);

  // Initialize dark mode state from localStorage or system preference
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(storedDarkMode);
    
    // Apply dark mode to document if enabled
    document.documentElement.classList.toggle('dark', storedDarkMode);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    document.documentElement.classList.toggle('dark', newDarkModeState);
    localStorage.setItem('darkMode', newDarkModeState.toString());
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Area */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3">
                <span className="font-bold text-xl relative">
                  {logoLetter}
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FunSpinner type={spinnerType as any} size="xs" variant="primary" />
                  </span>
                </span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white transition-all duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {config.companyName}
              </span>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium ${location === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 ${getHoverClass()}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`font-medium ${location === '/about' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 ${getHoverClass()}`}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className={`font-medium ${location === '/services' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 ${getHoverClass()}`}
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium ${location === '/contact' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 ${getHoverClass()}`}
            >
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className={`font-medium ${location === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 ${getHoverClass()}`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => logoutMutation.mutate()}
                  className={`font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 ${getHoverClass()}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="relative overflow-hidden text-white font-medium bg-primary-600 hover:bg-primary-700 px-5 py-2 rounded-md transition-all duration-300 group"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 h-full w-full bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </Link>
            )}
          </nav>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Hover Effect Control */}
            <button 
              onClick={cycleHoverEffect}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors group"
              title={`Current hover effect: ${hoverEffect}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </button>
            
            {/* Spinner Type Control */}
            <div className="flex items-center">
              <button 
                onClick={cycleSpinnerType}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors group"
                title={`Current spinner: ${spinnerType}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="ml-1">
                <FunSpinner type={spinnerType as any} size="xs" variant="primary" />
              </div>
            </div>
            
            {/* Theme Toggle Button - Only show if darkMode is enabled in config */}
            {config.features.darkMode && (
              <button 
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors group"
                onClick={toggleTheme}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu (Hidden by default) */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-900 md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn`}>
          <div className="flex flex-col space-y-4 px-4">
            <Link 
              href="/" 
              className={`font-medium ${location === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn`}
              style={{ animationDelay: '50ms' }}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`font-medium ${location === '/about' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn`}
              style={{ animationDelay: '100ms' }}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className={`font-medium ${location === '/services' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn`}
              style={{ animationDelay: '150ms' }}
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium ${location === '/contact' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn`}
              style={{ animationDelay: '200ms' }}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`font-medium ${location === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn`}
                  style={{ animationDelay: '250ms' }}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => logoutMutation.mutate()}
                  className="font-medium text-left text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn"
                  style={{ animationDelay: '300ms' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className={`font-medium ${location === '/auth' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-1 animate-fadeIn`}
                style={{ animationDelay: '250ms' }}
              >
                Login
              </Link>
            )}
            
            {/* Cool UI Controls Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn flex flex-col space-y-4" style={{ animationDelay: '350ms' }}>
              {/* Hover Effect Selector */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={cycleHoverEffect}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="ml-2">Change Hover Effect: <span className="font-semibold text-primary-500">{hoverEffect}</span></span>
                </button>
              </div>
              
              {/* Spinner Type Selector */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={cycleSpinnerType}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="ml-2">Change Spinner Type: <span className="font-semibold text-primary-500">{spinnerType}</span></span>
                </button>
                <div className="ml-2">
                  <FunSpinner type={spinnerType as any} size="sm" variant="primary" />
                </div>
              </div>
            </div>
            
            {/* Mobile Theme Toggle */}
            {config.features.darkMode && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <button 
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-300"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="ml-2">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="ml-2">Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
