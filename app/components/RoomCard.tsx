import React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import type { PublicRoom } from './Rooms';

interface RoomCardProps {
  room: PublicRoom;
  onDetails: () => void;
  onBook: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onDetails, onBook }) => {
  const NB_URL = process.env.NEXT_PUBLIC_NIGHTSBRIDGE_URL || 'https://book.nightsbridge.com/';
  const goToNightsBridge = () => {
    if (typeof window !== 'undefined') {
      window.open(NB_URL, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:ring-amber-300 backdrop-blur-sm">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={room.image} 
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transform hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          {room.type}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{room.name}</h3>
        <p className="text-slate-600 mb-4 line-clamp-2">{room.short_description || ''}</p>
        {room.price !== undefined && room.price !== null && (
          <p className="text-amber-600 font-semibold mb-4">R{room.price}/night</p>
        )}
        <div className="flex gap-3">
          <Button onClick={goToNightsBridge} variant="primary" className="flex-1">
            Book Now
          </Button>
          <Button onClick={onDetails} variant="outline" className="flex-1">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};
