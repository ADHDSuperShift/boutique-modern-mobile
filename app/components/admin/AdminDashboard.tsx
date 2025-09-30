'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { RoomsManager } from './RoomsManager';
import { EventsManager } from './EventsManager';
import { WinesManager } from './WinesManager';
import { HeroManager } from './HeroManager';
import { AmenitiesManager } from './AmenitiesManager';
import { RestaurantManager } from './RestaurantManager';
import { ContactManager } from './ContactManager';
import { BookingsView } from './BookingsView';
import { BarManager } from './BarManager';
import { WineBoutiqueManager } from './WineBoutiqueManager';
import { GalleryManager } from './GalleryManager';
import { AdminDebugPanel } from './AdminDebugPanel';
import { AdminErrorBoundary } from './AdminErrorBoundary';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rooms');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      // Clear Supabase auth artifacts from localStorage
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith('sb-') || k.startsWith('supabase.')) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {}
    // Hard redirect to re-evaluate session state
    window.location.replace('/admin?logout=1');
  };

  const tabs = [
    { id: 'rooms', label: 'Rooms' },
    { id: 'events', label: 'Events' },
    { id: 'wines', label: 'Wines' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'wine_boutique', label: 'Wine Boutique' },
    { id: 'bar', label: 'Bar' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
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
            <AdminErrorBoundary>
              <AdminDebugPanel />
              
              {activeTab === 'rooms' && (
                <AdminErrorBoundary>
                  <RoomsManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'events' && (
                <AdminErrorBoundary>
                  <EventsManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'wines' && (
                <AdminErrorBoundary>
                  <WinesManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'hero' && (
                <AdminErrorBoundary>
                  <HeroManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'amenities' && (
                <AdminErrorBoundary>
                  <AmenitiesManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'restaurant' && (
                <AdminErrorBoundary>
                  <RestaurantManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'wine_boutique' && (
                <AdminErrorBoundary>
                  <WineBoutiqueManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'bar' && (
                <AdminErrorBoundary>
                  <BarManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'gallery' && (
                <AdminErrorBoundary>
                  <GalleryManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'contact' && (
                <AdminErrorBoundary>
                  <ContactManager />
                </AdminErrorBoundary>
              )}
              {activeTab === 'bookings' && (
                <AdminErrorBoundary>
                  <BookingsView />
                </AdminErrorBoundary>
              )}
            </AdminErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};
