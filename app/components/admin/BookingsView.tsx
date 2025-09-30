'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, contactsRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false })
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
      
      // If no data from Supabase, add some demo data
      if (!bookingsRes.data || bookingsRes.data.length === 0) {
        setBookings([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+27 123 456 789',
            check_in: '2025-10-15',
            check_out: '2025-10-18',
            room: 'Deluxe Suite',
            guests: 2,
            created_at: '2025-09-25'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+27 987 654 321',
            check_in: '2025-10-20',
            check_out: '2025-10-22',
            room: 'Standard Room',
            guests: 1,
            created_at: '2025-09-26'
          }
        ]);
      }
      
      if (!contactsRes.data || contactsRes.data.length === 0) {
        setContacts([
          {
            id: '1',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            message: 'I would like to know more about your wine tasting events.',
            created_at: '2025-09-28'
          },
          {
            id: '2',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            message: 'Do you offer group discounts for events?',
            created_at: '2025-09-29'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">Room Bookings</h2>
        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <p className="text-slate-600">No bookings yet</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-gradient-to-br from-white to-amber-50/30 rounded-lg p-6 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{booking.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{booking.email} • {booking.phone}</p>
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">Room:</span> {booking.room} • <span className="font-medium">Guests:</span> {booking.guests}
                    </p>
                    <p className="text-sm text-amber-600 font-medium">
                      Check-in: {new Date(booking.check_in).toLocaleDateString()} | 
                      Check-out: {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                    <p className="text-sm">Guests: {booking.guests}</p>
                    {booking.message && <p className="text-sm mt-2 italic">{booking.message}</p>}
                  </div>
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    {booking.status || 'pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">Contact Messages</h2>
        <div className="grid gap-4">
          {contacts.length === 0 ? (
            <p className="text-slate-600">No messages yet</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="bg-gradient-to-br from-white to-amber-50/30 rounded-lg p-6 ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm">
                <h3 className="font-bold text-slate-800 text-lg">{contact.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{contact.email}</p>
                <p className="text-slate-700 mb-3">{contact.message}</p>
                <p className="text-xs text-slate-500">
                  {new Date(contact.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
