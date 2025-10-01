'use client';

import React from 'react';

export const FloatingBookButton: React.FC = () => {
  const NB_URL = process.env.NEXT_PUBLIC_NIGHTSBRIDGE_URL || 'https://book.nightsbridge.com/';
  const goToNightsBridge = () => {
    window.open(NB_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={goToNightsBridge}
      className="fixed bottom-8 left-8 z-30 bg-gradient-to-r from-[#060B3F] to-[#0E1E6E] text-yellow-300 px-6 py-4 rounded-full shadow-2xl hover:brightness-110 transition-all transform hover:scale-110 flex items-center gap-2 font-medium ring-1 ring-amber-400/30"
      aria-label="Book Now"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Book Now
    </button>
  );
};
