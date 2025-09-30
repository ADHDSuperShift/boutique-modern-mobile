'use client';

import React from 'react';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { Rooms } from './Rooms';
import { Restaurant } from './Restaurant';
import { WineBoutique } from './WineBoutique';
import { Events } from './Events';
import { Reviews } from './Reviews';
import { Footer } from './Footer';
import { FloatingBookButton } from './FloatingBookButton';

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Rooms />
      <Restaurant />
      <WineBoutique />
      <Events />
      <Reviews />
      <Footer />
      <FloatingBookButton />
    </div>
  );
}
