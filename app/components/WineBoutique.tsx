'use client';

import React, { useEffect, useState } from 'react';
import { wines as fallbackWines } from '../data/wines';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

type Wine = {
  id: string;
  name: string;
  image: string;
  tasting_notes?: string;
  vintage?: string;
  region?: string;
};

export const WineBoutique: React.FC = () => {
  const [header, setHeader] = useState({
    title: 'Wine Boutique',
    subtitle: 'Curated selections',
    description: 'Discover hand-picked wines from the Cape Winelands and beyond.',
    backgroundImage: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215824801_0c081541.webp'
  });
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [items, setItems] = useState<Wine[]>(fallbackWines as unknown as Wine[]);

  // Load wines from Supabase
  useEffect(() => {
    const load = async () => {
      try {
        // Header copy
        const { data: headerRow } = await supabase
          .from('wine_boutique_info')
          .select('title,subtitle,description,background_image')
          .maybeSingle();
        if (headerRow) {
          setHeader(prev => ({
            ...prev,
            title: headerRow.title ?? prev.title,
            subtitle: headerRow.subtitle ?? prev.subtitle,
            description: headerRow.description ?? prev.description,
            backgroundImage: headerRow.background_image ?? prev.backgroundImage,
          }));
        }

        const { data, error } = await supabase
          .from('wines')
          .select('*')
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('name');
        if (!error && data) {
          setItems(data as Wine[]);
        }
      } catch (_) {
        // keep fallbacks
      }
    };
    load();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const maxIndex = Math.max(0, items.length - 3);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const handleInquiry = (wine: Wine) => {
    setSelectedWine(wine);
    setShowInquiry(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('wine_inquiries').insert({
        wine_id: selectedWine?.id || null,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      alert(`Inquiry submitted for ${selectedWine?.name ?? 'a wine'}`);
    } catch (_) {
      alert('Inquiry submitted (offline mode).');
    } finally {
      setShowInquiry(false);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const nextImage = () => {
    const maxIndex = Math.max(0, items.length - 3);
    setCurrentImageIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    const maxIndex = Math.max(0, items.length - 3);
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1));
  };

  return (
    <section id="wine" className="py-20 bg-gradient-to-b from-slate-50 to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              {header.title}
            </h2>
            <p className="text-lg text-slate-600 mb-2">{header.subtitle}</p>
            <p className="text-lg text-slate-700">{header.description}</p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200 hover:shadow-3xl transition-all duration-300">
            <Image 
              src={header.backgroundImage}
              alt="Wine Boutique"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 text-center">Wine Collection</h3>
        
        {/* Wine Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 33.333}%)` }}
            >
      {items.map((wine) => (
                <div key={wine.id} className="w-1/3 flex-shrink-0 px-2">
                  <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6 hover:shadow-2xl hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
                    <div className="relative w-full h-48 mb-4">
                      <Image 
                        src={wine.image} 
                        alt={wine.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 33vw, 33vw"
                      />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2 text-sm">{wine.name}</h4>
        <p className="text-xs text-slate-600 mb-1">{wine.region}</p>
        <p className="text-xs text-amber-600 mb-3 font-medium">{wine.vintage}</p>
                    <Button 
                      onClick={() => handleInquiry(wine)} 
                      variant="primary" 
                      className="w-full text-sm py-2"
                    >
                      Inquire
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-3 rounded-full hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-3 rounded-full hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            →
          </button>
          
          {/* Carousel Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, items.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-md' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showInquiry} onClose={() => setShowInquiry(false)}>
        <div className="p-8 bg-gradient-to-br from-white to-amber-50/50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Inquire About {selectedWine?.name}
          </h3>
          <p className="text-slate-600 mb-6">{selectedWine?.tasting_notes}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
            <textarea
              placeholder="Your message or quantity needed"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
            <Button type="submit" variant="primary" className="w-full">
              Send Inquiry
            </Button>
          </form>
        </div>
      </Modal>
    </section>
  );
};
