'use client';

import React, { useState } from 'react';
import { rooms } from '../data/rooms';
import { RoomCard } from './RoomCard';
import { RoomModal } from './RoomModal';
import { BookingModal } from './BookingModal';

export const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingRoom, setBookingRoom] = useState<string>('');

  const handleDetails = (room: any) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

  const handleBook = (roomName: string) => {
    setBookingRoom(roomName);
    setShowBooking(true);
    setShowDetails(false);
  };

  return (
    <section id="rooms" className="py-20 bg-gradient-to-b from-amber-50/30 to-slate-50">
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
          {rooms.map((room) => (
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
        onBook={() => handleBook(selectedRoom?.name)}
      />

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        roomName={bookingRoom}
      />
    </section>
  );
};
