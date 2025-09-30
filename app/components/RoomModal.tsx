'use client';

import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface Room {
  name: string;
  type: string;
  description: string;
  amenities: string[];
  images: string[];
}

interface RoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, isOpen, onClose, onBook }) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!room) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <div className="relative h-96 rounded-xl overflow-hidden mb-4">
            <img 
              src={room.images[currentImage]} 
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {room.images.map((_, idx) => (
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
        <p className="text-gray-700 mb-6">{room.description}</p>

        <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Amenities</h3>
        <ul className="grid grid-cols-2 gap-2 mb-6">
          {room.amenities.map((amenity, idx) => (
            <li key={idx} className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-[#8B9D83] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {amenity}
            </li>
          ))}
        </ul>

        <Button onClick={onBook} variant="primary" className="w-full">
          Book This Room
        </Button>
      </div>
    </Modal>
  );
};
