'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

const fallbackImages = [
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215820600_2c2bb234.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215822339_23c8b418.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215824058_d059efb7.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215819859_d1a76dd0.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215800577_ecbf1d1d.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215802323_7a0a2f9a.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215804031_2b1f3f2a.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215805666_abc12345.webp',
];

export const Gallery: React.FC = () => {
  const [title, setTitle] = useState('Gallery');
  const [images, setImages] = useState<string[]>(fallbackImages);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('gallery_section')
          .select('title, images')
          .maybeSingle();
        if (data) {
          setTitle(data.title ?? 'Gallery');
          if (Array.isArray(data.images) && data.images.length > 0) {
            setImages(data.images);
          }
        }
      } catch (_) {
        // keep fallbacks
      }
    };
    load();
  }, []);

  const validImages = images.filter(Boolean);

  return (
    <section id="gallery" className="py-16 bg-slate-100 dark:bg-slate-900/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 dark:from-amber-200 dark:to-yellow-200">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {validImages.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-slate-700">
              <Image src={src} alt={`Gallery ${i+1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
