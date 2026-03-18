// components/New/components/Topbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Truck, 
  Globe, 
  ChevronDown, 
  DollarSign,
  Clock,
  Shield 
} from 'lucide-react';

interface TopbarProps {
  isDarkMode?: boolean;
}

const Topbar = ({ isDarkMode }: TopbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
  const languages = ['EN', 'ES', 'FR', 'DE', 'IT', 'AR'];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[var(--color-background-soft)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          
          {/* Left side - Shipping info with animated truck */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-2 group">
              <div className="relative">
                <Truck className="w-4 h-4 text-[var(--color-primary)] group-hover:animate-bounce-subtle" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full animate-ping opacity-75"></span>
              </div>
              <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                Free shipping on orders over $50
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span>100% Secure Payments</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Right side - Currency & Language selectors */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrency(!showCurrency);
                  setShowLanguage(false);
                }}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-all duration-200 group"
              >
                <DollarSign className="w-4 h-4" />
                <span>{selectedCurrency}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCurrency ? 'rotate-180' : ''}`} />
              </button>

              {/* Currency Dropdown */}
              {showCurrency && (
                <div className="absolute top-full right-0 mt-1 w-24 bg-[var(--color-surface)] rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        setSelectedCurrency(currency);
                        setShowCurrency(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors ${
                        selectedCurrency === currency ? 'text-[var(--color-primary)] bg-[var(--color-primary-soft)]/50' : ''
                      }`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLanguage(!showLanguage);
                  setShowCurrency(false);
                }}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-all duration-200 group"
              >
                <Globe className="w-4 h-4" />
                <span>{selectedLanguage}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLanguage ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {showLanguage && (
                <div className="absolute top-full right-0 mt-1 w-24 bg-[var(--color-surface)] rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        setSelectedLanguage(language);
                        setShowLanguage(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] transition-colors ${
                        selectedLanguage === language ? 'text-[var(--color-primary)] bg-[var(--color-primary-soft)]/50' : ''
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;