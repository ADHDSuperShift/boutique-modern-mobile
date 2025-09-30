'use client';

import React from 'react';

export const FloatingBookButton: React.FC = () => {
  const scrollToRooms = () => {
    document.querySelector('#rooms')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToRooms}
      className="fixed bottom-8 right-8 z-30 bg-[#C67B5C] text-white px-6 py-4 rounded-full shadow-2xl hover:bg-[#B56A4B] transition-all transform hover:scale-110 flex items-center gap-2 font-medium"
      aria-label="Book Now"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Book Now
    </button>
  );
};
