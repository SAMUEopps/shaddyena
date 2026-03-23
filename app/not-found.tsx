// app/not-found.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const suggestedLinks = [
    { name: 'New Arrivals', href: '/new-arrivals', icon: Compass },
    { name: 'Best Sellers', href: '/best-sellers', icon: Search },
    { name: 'Home', href: '/', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center relative overflow-hidden px-6">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--color-primary-alt)]/10 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`,
            transition: 'transform 0.3s ease-out',
            animationDelay: '1s',
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-primary),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        
        {/* 404 Number with Animation */}
        <div className="relative mb-8">
          <h1 
            className={`text-9xl sm:text-[12rem] font-bold leading-none tracking-tighter transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-alt)] to-[var(--color-primary)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              404
            </span>
          </h1>
          
          {/* Floating Elements Around 404 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--color-primary)]/30 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div 
          className={`space-y-4 transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            Page not found
          </h2>
          
          <p className="text-[var(--color-text-muted)] max-w-md mx-auto text-base sm:text-lg leading-relaxed">
            The page you're looking for doesn't exist, may have been moved or under construction.
          </p>
        </div>

        {/* Suggested Links */}
        {/*<div 
          className={`mt-10 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {suggestedLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className="group flex items-center gap-2 px-5 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:shadow-lg hover:shadow-[var(--color-primary)]/10 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          ))}
        </div>*/}

        {/* Primary CTA */}
        <div 
          className={`mt-8 transition-all duration-1000 delay-600 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary-alt)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-primary)]/25 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Fun Element - Random Quote */}
        <div 
          className={`mt-12 pt-8 border-t border-[var(--color-border)]/50 transition-all duration-1000 delay-800 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/*<p className="text-xs text-[var(--color-text-muted)] italic">
            "Even the best explorers get lost sometimes."
          </p>*/}
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[var(--color-border)]/30 rounded-tl-3xl hidden sm:block" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[var(--color-border)]/30 rounded-br-3xl hidden sm:block" />

      {/* Add required animations to global.css */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}