'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Restaurant', href: '#restaurant' },
    { label: 'Wine Boutique', href: '#wine' },
    { label: 'Events', href: '#events' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' }
  ];

  const handleClick = (href: string) => {
    setIsOpen(false);
    if (href === '/admin') {
      // Navigate to admin page
      window.location.href = '/admin';
      return;
    }
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
  <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#060B3F] to-[#0E1E6E] backdrop-blur-md shadow-2xl border-b border-amber-400/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => handleClick('#home')}
            className="flex items-center gap-3 group"
            aria-label="Go to Home"
          >
            {/* Logo (replace with your final asset if needed) */}
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg ring-1 ring-amber-400/30 bg-white/10 overflow-hidden">
              <Image
                src="/469874614_981235907371376_5422540359514130437_n.jpg"
                alt="Site logo"
                width={48}
                height={48}
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Barrydale
              </span>
              <span className="text-sm md:text-base text-white/90 group-hover:text-amber-200 transition-colors">
                Karoo Lodge
              </span>
            </span>
          </button>
          
          {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
        className="text-white font-medium hover:text-amber-300 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 hover:shadow-lg relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            
            {/* Admin Button */}
            <button
              onClick={() => handleClick('/admin')}
              className="text-white font-medium hover:text-amber-300 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 hover:shadow-lg relative group border border-amber-400/30"
            >
              Admin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Mobile Burger Menu - Hidden on desktop */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex flex-col justify-center items-center space-y-1.5 hover:opacity-70 transition-opacity"
          >
            <span className={`block w-6 h-0.5 bg-amber-400 transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-amber-400 transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-amber-400 transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Only shows on mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-opacity-98 flex items-center justify-center animate-fadeIn">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-amber-400 text-4xl hover:opacity-70 transition-opacity"
          >
            ×
          </button>
          <ul className="space-y-8 text-center">
            {menuItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleClick(item.href)}
                  className="text-slate-200 text-3xl md:text-4xl font-light hover:text-amber-400 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            ))}
            
            {/* Admin Button for Mobile */}
            <li>
              <button
                onClick={() => handleClick('/admin')}
                className="text-slate-200 text-3xl md:text-4xl font-light hover:text-amber-400 transition-colors relative group border border-amber-400/30 px-6 py-2 rounded-lg"
              >
                Admin
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
