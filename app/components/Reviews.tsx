'use client';

import React from 'react';
import { Button } from './ui/Button';

export const Reviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      location: "Cape Town",
      rating: 5,
      review: "Absolutely stunning boutique lodge! The attention to detail is incredible and the wine selection is world-class. Perfect for a romantic getaway.",
      date: "September 2025"
    },
    {
      id: 2,
      name: "James R.",
      location: "Johannesburg", 
      rating: 5,
      review: "The staff went above and beyond to make our stay memorable. The restaurant serves exceptional cuisine and the rooms are beautifully appointed.",
      date: "August 2025"
    },
    {
      id: 3,
      name: "Maria L.",
      location: "London, UK",
      rating: 5,
      review: "Hidden gem in the Karoo! The authentic South African experience combined with luxury amenities made this trip unforgettable.",
      date: "July 2025"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-amber-400' : 'text-slate-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-slate-100 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Guest Reviews
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
            Discover what our guests are saying about their unforgettable experiences at Barrydale Karoo Lodge.
          </p>
          
          {/* TripAdvisor Button */}
          <div className="flex justify-center mb-12">
            <Button 
              variant="primary" 
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open('https://www.tripadvisor.com', '_blank')}
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Read More on TripAdvisor
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl p-6 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-3">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-slate-500">{review.date}</span>
              </div>
              
              <p className="text-slate-700 mb-4 italic">&ldquo;{review.review}&rdquo;</p>
              
              <div className="border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-800">{review.name}</p>
                <p className="text-sm text-slate-600">{review.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">Share your experience with us!</p>
          <Button 
            variant="outline" 
            className="border-amber-400 text-amber-600 hover:bg-amber-50"
            onClick={() => window.open('https://www.tripadvisor.com', '_blank')}
          >
            Write a Review
          </Button>
        </div>
      </div>
    </section>
  );
};
