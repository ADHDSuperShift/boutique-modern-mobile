import React from 'react';

export const Footer: React.FC = () => {
  return (
  <footer className="bg-gradient-to-b from-[#060B3F] to-[#0E1E6E] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold font-display bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent mb-4">Barrydale Karoo Lodge</h3>
            <p className="text-white/80">
              Boutique comfort in the heart of Route 62
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-amber-300">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#rooms" className="hover:text-amber-400 transition-colors">Rooms</a></li>
              <li><a href="#restaurant" className="hover:text-amber-400 transition-colors">Restaurant</a></li>
              <li><a href="#wine" className="hover:text-amber-400 transition-colors">Wine Boutique</a></li>
              <li><a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-amber-300">Contact</h4>
            <ul className="space-y-2 text-white/80">
              <li>11 Tennant Street</li>
              <li>Barrydale, 6750</li>
              <li>+27 (028) 572 1020</li>
              <li>info@barrydalekaroolodge.co.za</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-amber-300">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M22.675 0h-21.35C0.596 0 0 0.596 0 1.325v21.351C0 23.404 0.596 24 1.325 24H12.82v-9.294H9.692v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.311h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.404 24 22.676V1.325C24 0.596 23.404 0 22.675 0z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.977.24 2.435.403.59.205 1.012.45 1.456.893.444.444.688.866.893 1.456.163.458.349 1.265.403 2.435.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.977-.403 2.435-.205.59-.45 1.012-.893 1.456-.444.444-.866.688-1.456.893-.458.163-1.265.349-2.435.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.977-.24-2.435-.403-.59-.205-1.012-.45-1.456-.893-.444-.444-.688-.866-.893-1.456-.163-.458-.349-1.265-.403-2.435C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.977.403-2.435.205-.59.45-1.012.893-1.456.444-.444.866-.688 1.456-.893.458-.163 1.265-.349 2.435-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.684c-3.17 0-3.548.012-4.796.07-.997.046-1.538.213-1.897.355-.477.185-.82.406-1.182.768-.362.362-.583.705-.768 1.182-.142.359-.309.9-.355 1.897-.058 1.248-.07 1.626-.07 4.796s.012 3.548.07 4.796c.046.997.213 1.538.355 1.897.185.477.406.82.768 1.182.362.362.705.583 1.182.768.359.142.9.309 1.897.355 1.248.058 1.626.07 4.796.07s3.548-.012 4.796-.07c.997-.046 1.538-.213 1.897-.355.477-.185.82-.406 1.182-.768.362-.362.583-.705.768-1.182.142-.359.309-.9.355-1.897.058-1.248.07-1.626.07-4.796s-.012-3.548-.07-4.796c-.046-.997-.213-1.538-.355-1.897-.185-.477-.406-.82-1.182-.768-.359-.142-.9-.309-1.897-.355-1.248-.058-1.626-.07-4.796-.07zm0 3.905a5.248 5.248 0 110 10.496 5.248 5.248 0 010-10.496zm0 1.684a3.564 3.564 0 100 7.128 3.564 3.564 0 000-7.128zm5.406-3.84a1.224 1.224 0 110 2.448 1.224 1.224 0 010-2.448z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M18.244 2h3.514l-7.675 8.77L24 22h-7.828l-6.127-7.46L3.1 22H-.414l8.21-9.395L0 2h7.828l5.82 7.09L18.244 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p className="font-display">&copy; 2025 Barrydale Karoo Lodge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
