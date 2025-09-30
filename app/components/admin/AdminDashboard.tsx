'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { RoomsManager } from './RoomsManager';
import { EventsManager } from './EventsManager';
import { WinesManager } from './WinesManager';
import { BookingsView } from './BookingsView';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rooms');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const tabs = [
    { id: 'rooms', label: 'Rooms' },
    { id: 'events', label: 'Events' },
    { id: 'wines', label: 'Wines' },
    { id: 'bookings', label: 'Bookings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30">
      <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-amber-400/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-2xl ring-1 ring-slate-200 overflow-hidden backdrop-blur-sm">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-300 relative group ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {activeTab !== tab.id && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'rooms' && <RoomsManager />}
            {activeTab === 'events' && <EventsManager />}
            {activeTab === 'wines' && <WinesManager />}
            {activeTab === 'bookings' && <BookingsView />}
          </div>
        </div>
      </div>
    </div>
  );
};
