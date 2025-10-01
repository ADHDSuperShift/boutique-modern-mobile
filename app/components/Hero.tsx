'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';

export const Hero: React.FC = () => {
  const [hero, setHero] = useState({
    title: 'Barrydale Karoo Lodge',
    subtitle: 'Boutique comfort in the heart of Route 62',
    description: 'Discover a haven of relaxation, fine dining, and authentic Karoo charm',
    backgroundImage: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215800577_ecbf1d1d.webp',
    ctaText: 'Book Your Stay',
    ctaLink: '#rooms',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_section')
          .select('title,subtitle,description,background_image,cta_text,cta_link')
          .maybeSingle();
    if (!error && data) {
          setHero(prev => ({
            ...prev,
            title: data.title || prev.title,
            subtitle: data.subtitle || prev.subtitle,
            description: data.description || prev.description,
      backgroundImage: data.background_image || prev.backgroundImage,
      ctaText: data.cta_text || prev.ctaText,
      ctaLink: data.cta_link || prev.ctaLink,
          }));
        }
      } catch (_) {
        // keep fallbacks
      }
    };
    load();
  }, []);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${hero.backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/80" />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">{hero.title}</h1>
        <p className="text-xl md:text-2xl mb-4 font-light animate-fadeIn text-slate-200" style={{ animationDelay: '0.2s' }}>{hero.subtitle}</p>
        <p className="text-lg md:text-xl mb-8 animate-fadeIn text-slate-300" style={{ animationDelay: '0.4s' }}>{hero.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <Button onClick={() => scrollToSection('#rooms')} variant="outline">Explore Rooms</Button>
        </div>
      </div>
    </section>
  );
};
