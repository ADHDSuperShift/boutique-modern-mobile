import React from 'react';

const amenities = [
  {
    title: 'Splash Pool & Sun Terrace',
    description: 'Relax by our outdoor pool with stunning mountain views',
    icon: '🏊'
  },
  {
    title: 'Windpomp Bar',
    description: 'Cocktails and Karoo sunsets in our signature bar',
    icon: '🍹'
  },
  {
    title: 'Fireplace Lounge',
    description: 'Cozy evenings by the fire with complimentary refreshments',
    icon: '🔥'
  },
  {
    title: 'Conference Room',
    description: 'Professional space for up to 20 people with projector & WiFi',
    icon: '💼'
  }
];

export const Amenities: React.FC = () => {
  return (
    <section className="py-20 bg-[#E8DCC4] bg-opacity-30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">
            Lodge Amenities
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Experience comfort and convenience with our thoughtfully curated facilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {amenities.map((amenity, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">{amenity.icon}</div>
              <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3">{amenity.title}</h3>
              <p className="text-gray-700">{amenity.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215838487_c41014e0.webp" 
            alt="Pool and Terrace"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </section>
  );
};
