'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl p-6 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Address</h3>
              <p className="text-slate-600">11 Tennant Street<br/>Barrydale, Western Cape, 6750<br/>South Africa</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl p-6 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Phone</h3>
              <p className="text-slate-600">+27 (028) 572 1020</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl p-6 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Email</h3>
              <p className="text-slate-600">
                reservations@barrydalekaroolodge.co.za<br/>
                info@barrydalekaroolodge.co.za
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-8 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
