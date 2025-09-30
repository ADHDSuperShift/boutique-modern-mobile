'use client';

import React, { useState, useEffect } from 'react';
import { wines } from '../data/wines';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

export const WineBoutique: React.FC = () => {
  const [selectedWine, setSelectedWine] = useState<any>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const maxIndex = Math.max(0, wines.length - 3);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInquiry = (wine: any) => {
    setSelectedWine(wine);
    setShowInquiry(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Inquiry submitted for ${selectedWine.name}`);
    setShowInquiry(false);
  };

  const nextImage = () => {
    const maxIndex = Math.max(0, wines.length - 3);
    setCurrentImageIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    const maxIndex = Math.max(0, wines.length - 3);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  return (
    <section id="wine" className="py-20 bg-gradient-to-b from-slate-50 to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Wine Boutique
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Celebrate the region&apos;s winemaking heritage at our boutique wine corner. Hand-picked selections 
              from the Cape Winelands and beyond are available for tasting or to take home. Each bottle tells 
              a story of South African terroir and craftsmanship.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200 hover:shadow-3xl transition-all duration-300">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215824801_0c081541.webp" 
              alt="Wine Boutique"
              className="w-full h-96 object-cover"
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
              {wines.map((wine) => (
                <div key={wine.id} className="w-1/3 flex-shrink-0 px-2">
                  <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6 hover:shadow-2xl hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
                    <img 
                      src={wine.image} 
                      alt={wine.name}
                      className="w-full h-48 object-contain mb-4"
                    />
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
            {Array.from({ length: Math.max(1, wines.length - 2) }).map((_, index) => (
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
          <p className="text-slate-600 mb-6">{selectedWine?.tastingNotes}</p>
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
