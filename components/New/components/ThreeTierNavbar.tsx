// components/New/components/ThreeTierNavbar.tsx
'use client';

import { useState, useEffect } from 'react';

import MainNavbar from './MainNavbar';
import BottomNavbar from './BottomNavbar';
import Topbar from './TopBar';

const ThreeTierNavbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize dark mode
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]">
        <div className="h-10 bg-[var(--color-background-soft)]" /> {/* Topbar skeleton */}
        <div className="h-16 bg-[var(--color-background)]" /> {/* Main navbar skeleton */}
        <div className="h-14 bg-[var(--color-background)] border-t border-[var(--color-border)]" /> {/* Bottom navbar skeleton */}
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Topbar - Always visible */}
      <Topbar isDarkMode={isDarkMode} />
      
      {/* Main Navbar - Middle tier */}
      <MainNavbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isScrolled={isScrolled}
      />
      
      {/* Bottom Navbar - Search and menu */}
      <BottomNavbar isScrolled={isScrolled} />
      
      {/* Spacer for fixed positioning */}
      <div className="h-[calc(2.5rem+4rem+3.5rem)]" />
    </header>
  );
};

export default ThreeTierNavbar;