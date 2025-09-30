'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { events as fallbackEvents } from '../data/events';
import { supabase } from '../lib/supabase';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

type EventItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  category: string;
};

export const Events: React.FC = () => {
  const [items, setItems] = useState<EventItem[]>(fallbackEvents as unknown as EventItem[]);
  const [loading, setLoading] = useState(true);
  const [enquireFor, setEnquireFor] = useState<EventItem | null>(null);
  const [enq, setEnq] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id,title,date,image,description,category')
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

  const formatMonth = (d: Date) => d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const formatDay = (d: Date) => d.getDate();
  const formatTime = (d: Date) => {
    const hrs = d.getHours();
    const mins = d.getMinutes();
    if (hrs === 0 && mins === 0) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const events = useMemo(() => items.map(e => ({
    ...e,
    dateObj: new Date(e.date)
  })), [items]);

  if (loading) {
    return (
      <section id="events" className="py-20 bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-900/60">
        <div className="container mx-auto px-4 text-center text-slate-600">Loading…</div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-900/60">
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

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden ring-1 ring-slate-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                {/* Date + details */}
                <div className="flex items-center gap-4 w-full">
                  <div className="flex flex-col items-center justify-center bg-slate-100 rounded-lg px-3 py-2 w-16 shrink-0">
                    <div className="text-[10px] font-semibold tracking-wider text-slate-600">{formatMonth(event.dateObj)}</div>
                    <div className="text-xl font-bold text-slate-800 leading-none">{formatDay(event.dateObj)}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      {event.category && (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {event.category}
                        </span>
                      )}
                      {formatTime(event.dateObj) && (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {formatTime(event.dateObj)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 truncate">{event.title}</h3>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setEnquireFor(event)}>Enquire</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!enquireFor} onClose={() => { setEnquireFor(null); setEnq({ name: '', email: '', message: '' }); }}>
        {enquireFor && (
          <div className="p-6 bg-white">
            <h3 className="text-xl font-semibold mb-4">Enquire about: {enquireFor.title}</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await supabase.from('event_inquiries').insert({
                    event_id: enquireFor.id,
                    name: enq.name,
                    email: enq.email,
                    message: enq.message,
                  });
                  alert('Thanks! We\'ll get back to you.');
                } catch (_) {
                  alert('Enquiry submitted (offline mode).');
                } finally {
                  setEnquireFor(null);
                  setEnq({ name: '', email: '', message: '' });
                }
              }}
              className="space-y-3"
            >
              <input
                type="text"
                required
                placeholder="Your name"
                value={enq.name}
                onChange={(e) => setEnq({ ...enq, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <input
                type="email"
                required
                placeholder="Your email"
                value={enq.email}
                onChange={(e) => setEnq({ ...enq, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <textarea
                required
                placeholder="Message"
                value={enq.message}
                onChange={(e) => setEnq({ ...enq, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <Button type="submit" variant="primary" className="w-full">Send Enquiry</Button>
            </form>
          </div>
        )}
      </Modal>
    </section>
  );
};
