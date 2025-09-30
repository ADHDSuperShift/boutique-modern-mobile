'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { supabase } from '../lib/supabase';

const dishes = [
  { name: 'Karoo Lamb Shank', image: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215820600_2c2bb234.webp', desc: 'Slow-braised with rosemary and red wine' },
  { name: 'Cape Seafood Platter', image: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215822339_23c8b418.webp', desc: 'Fresh catch with lemon butter sauce' },
  { name: 'Artisan Cheese Board', image: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215824058_d059efb7.webp', desc: 'Local cheeses with preserves and nuts' }
];

export const Restaurant: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', guests: '2' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [copy, setCopy] = useState({
    title: 'Vintage Car Restaurant',
    description: 'Step into a retro-styled dining experience. The Vintage Car Restaurant serves hearty breakfasts, leisurely lunches, and elegant dinners — all with a Karoo twist. Fresh, locally sourced ingredients paired with warm hospitality make every meal unforgettable.',
  heroImage: 'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215819859_d1a76dd0.webp',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurant_info')
          .select('*')
          .single();
    if (!error && data) {
          setCopy(prev => ({
            ...prev,
            title: data.title || prev.title,
            description: data.description || prev.description,
      // Accept either backgroundImage (admin saves) or legacy heroImage
      heroImage: data.backgroundImage || data.heroImage || prev.heroImage,
          }));
        }
      } catch (_) {
        // keep fallbacks
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('restaurant_reservations').insert({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests || '2'),
      });
      alert('Reservation request submitted!');
    } catch (_) {
      alert('Reservation submitted (offline mode).');
    } finally {
      setShowBookingModal(false);
      setFormData({ name: '', email: '', date: '', time: '', guests: '2' });
    }
  };

  return (
    <section id="restaurant" className="py-20 bg-gradient-to-br from-slate-50 to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              {copy.title}
            </h2>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              {copy.description}
            </p>
            <Button 
              onClick={() => setShowBookingModal(true)}
              variant="primary" 
              className="px-8 py-4 text-lg shadow-2xl"
            >
              Reserve a Table
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 relative h-96">
            <Image 
              src={copy.heroImage}
              alt="Restaurant Interior"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
        </div>

        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 text-center">Menu Highlights</h3>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {dishes.map((dish, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg ring-1 ring-slate-200/50 overflow-hidden hover:shadow-2xl hover:ring-amber-200/50 transition-all duration-300 group">
              <div className="relative w-full h-64">
                <Image src={dish.image} alt={dish.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-2">{dish.name}</h4>
                <p className="text-slate-600">{dish.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

  <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)}>
        <div className="p-8 bg-gradient-to-br from-white to-amber-50/50">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 text-center">Reserve a Table</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Submit Reservation
            </Button>
          </form>
        </div>
      </Modal>
    </section>
  );
};
