'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { PublicRoom } from './Rooms';

interface RoomModalProps {
  room: PublicRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, isOpen, onClose, onBook }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const NB_URL = process.env.NEXT_PUBLIC_NIGHTSBRIDGE_URL || 'https://book.nightsbridge.com/';
  const goToNightsBridge = () => {
    if (typeof window !== 'undefined') {
      window.open(NB_URL, '_blank', 'noopener,noreferrer');
    }
  };

  const nextImage = (total: number) => {
    setCurrentImage((idx) => (total > 0 ? (idx + 1) % total : 0));
  };

  const prevImage = (total: number) => {
    setCurrentImage((idx) => (total > 0 ? (idx - 1 + total) % total : 0));
  };

  useEffect(() => {
    // reset carousel when switching rooms
    setCurrentImage(0);
  }, [room?.id]);

  if (!room) return null;

  const images: string[] = room.images && room.images.length > 0
    ? room.images
    : room.image
      ? [room.image]
      : [];
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <div className="relative h-96 rounded-xl overflow-hidden mb-4">
            {images[0] ? (
              <Image 
                src={images[currentImage]}
                alt={room.name}
                fill
                sizes="(max-width: 768px) 100vw, 1000px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
            {images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  aria-label="Previous image"
                  onClick={() => prevImage(images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
                >
                  ←
                </button>
                {/* Right Arrow */}
                <button
                  aria-label="Next image"
                  onClick={() => nextImage(images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
                >
                  →
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentImage ? 'bg-white w-8' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">{room.name}</h2>
        <p className="text-[#C67B5C] text-lg mb-4">{room.type}</p>
        <p className="text-gray-700 mb-6">{room.description || room.short_description}</p>

        <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Amenities</h3>
        <ul className="grid grid-cols-2 gap-2 mb-6">
          {amenities.map((amenity, idx) => (
            <li key={idx} className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-[#8B9D83] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {amenity}
            </li>
          ))}
        </ul>

  <Button onClick={goToNightsBridge} variant="primary" className="w-full">
          Book This Room
        </Button>
      </div>
    </Modal>
  );
};
