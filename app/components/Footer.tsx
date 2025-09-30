import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-4">Barrydale Karoo Lodge</h3>
            <p className="text-slate-400">
              Boutique comfort in the heart of Route 62
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#rooms" className="hover:text-amber-400 transition-colors">Rooms</a></li>
              <li><a href="#restaurant" className="hover:text-amber-400 transition-colors">Restaurant</a></li>
              <li><a href="#wine" className="hover:text-amber-400 transition-colors">Wine Boutique</a></li>
              <li><a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li>11 Tennant Street</li>
              <li>Barrydale, 6750</li>
              <li>+27 (028) 572 1020</li>
              <li>info@barrydalekaroolodge.co.za</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-amber-400">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg">
                <span className="text-xl text-white">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg">
                <span className="text-xl text-white">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg">
                <span className="text-xl text-white">ig</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Barrydale Karoo Lodge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
