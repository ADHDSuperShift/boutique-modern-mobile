'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

export const Bar: React.FC = () => {
  const [copy, setCopy] = useState({
    title: 'Windpomp Bar',
    subtitle: 'Crafted drinks & easy vibes',
    description: 'Relax at the Windpomp Bar with signature cocktails, local spirits, and good company.',
    heroImage: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215819859_d1a76dd0.webp',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('bar_info')
          .select('title,subtitle,description,background_image')
          .maybeSingle();
        if (!error && data) {
          setCopy(prev => ({
            ...prev,
            title: data.title || prev.title,
            subtitle: data.subtitle || prev.subtitle,
            description: data.description || prev.description,
            heroImage: data.background_image || prev.heroImage,
          }));
        }
      } catch (_) {
        // keep fallbacks
      }
    };
    load();
  }, []);

  return (
    <section id="bar" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              {copy.title}
            </h2>
            <p className="text-lg text-slate-600 mb-2">{copy.subtitle}</p>
            <p className="text-lg text-slate-700 leading-relaxed">{copy.description}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 relative h-96">
            <Image 
              src={copy.heroImage}
              alt="Windpomp Bar"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bar;
