'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { events as fallbackEvents } from '../data/events';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  category: string;
};

export const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [items, setItems] = useState<EventItem[]>(fallbackEvents as unknown as EventItem[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('date', { ascending: true });
        if (!error && data) {
          setItems(
            data.map((e: any) => ({
              id: e.id,
              title: e.title,
              date: e.date,
              image: e.image,
              description: e.description,
              category: e.category,
            }))
          );
        }
      } catch (_) {
        // use fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section id="events" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 text-center text-slate-600">Loading…</div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            From live music evenings to seasonal celebrations, Barrydale Karoo Lodge is more than a stay — 
            it&apos;s an experience. Discover what&apos;s happening during your visit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((event) => (
            <div 
              key={event.id} 
              className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden hover:shadow-2xl hover:ring-amber-300 transition-all cursor-pointer transform hover:scale-105 backdrop-blur-sm"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="relative w-full h-64">
                <Image 
                  src={event.image} 
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    {event.category}
                  </span>
                  <span className="text-slate-600 text-sm">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                <p className="text-slate-600 line-clamp-3">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <div>
            <div className="relative w-full h-96">
              <Image 
                src={selectedEvent.image} 
                alt={selectedEvent.title}
                fill
                sizes="(max-width: 768px) 100vw, 1000px"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-8 bg-gradient-to-br from-white to-amber-50/50">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-full font-medium shadow-sm">
                  {selectedEvent.category}
                </span>
                <span className="text-slate-600 text-lg">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">{selectedEvent.title}</h2>
              <p className="text-slate-600 text-lg mb-6">{selectedEvent.description}</p>
              <Button variant="primary" className="w-full">
                Register Interest
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
