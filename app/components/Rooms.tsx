'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { rooms as fallbackRooms } from '../data/rooms';
import { RoomCard } from './RoomCard';
import { RoomModal } from './RoomModal';
import { BookingModal } from './BookingModal';
import { supabase } from '../lib/supabase';

export type PublicRoom = {
  id: string;
  name: string;
  type: string;
  description?: string;
  short_description?: string;
  price?: number;
  image: string;
  images?: string[];
  amenities?: string[];
};

export const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<PublicRoom | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingRoom, setBookingRoom] = useState<string>('');
  const [items, setItems] = useState<PublicRoom[]>(fallbackRooms as unknown as PublicRoom[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('name');
        if (!error && data) {
          setItems(
            data.map((r: any) => ({
              id: r.id,
              name: r.name,
              type: r.type,
              description: r.description,
              short_description: r.short_description,
              price: r.price == null ? undefined : Number(r.price),
              image: r.image,
              images: r.images || (r.image ? [r.image] : []),
              amenities: Array.isArray(r.amenities) ? r.amenities : [],
            }))
          );
        }
      } catch (_) {
        // keep fallbacks
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDetails = (room: PublicRoom) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

  const handleBook = (roomName: string) => {
    setBookingRoom(roomName);
    setShowBooking(true);
    setShowDetails(false);
  };

  if (loading) {
    return (
  <section id="rooms" className="py-20 bg-gradient-to-b from-amber-50/30 to-slate-100">
        <div className="container mx-auto px-4 text-center text-slate-600">Loading…</div>
      </section>
    );
  }

  return (
  <section id="rooms" className="py-20 bg-gradient-to-b from-amber-50/30 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Our Accommodations
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our 11 uniquely designed rooms, each offering authentic Karoo charm and modern comfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onDetails={() => handleDetails(room)}
              onBook={() => handleBook(room.name)}
            />
          ))}
        </div>
      </div>

      <RoomModal
        room={selectedRoom}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onBook={() => selectedRoom && handleBook(selectedRoom.name)}
      />

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        roomName={bookingRoom}
      />
    </section>
  );
};
