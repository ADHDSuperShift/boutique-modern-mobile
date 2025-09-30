'use client';

import React from 'react';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { Rooms } from './Rooms';
import { Restaurant } from './Restaurant';
import { WineBoutique } from './WineBoutique';
import { Bar } from './Bar';
import { Events } from './Events';
import { Gallery } from './Gallery';
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
  <Bar />
      <Events />
  <Gallery />
      <Reviews />
      <Footer />
      <FloatingBookButton />
    </div>
  );
}
