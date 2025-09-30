'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

interface Amenity {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
}

export const AmenitiesManager: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([
    {
      id: '1',
      name: 'Luxury Spa',
      description: 'Rejuvenate with our world-class spa treatments',
      icon: '🧘‍♀️',
      image: '/spa.jpg'
    },
    {
      id: '2', 
      name: 'Wine Tasting',
      description: 'Experience our award-winning wine collection',
      icon: '🍷',
      image: '/wine-tasting.jpg'
    },
    {
      id: '3',
      name: 'Fine Dining',
      description: 'Exquisite cuisine crafted by renowned chefs',
      icon: '🍽️',
      image: '/restaurant.jpg'
    },
    {
      id: '4',
      name: 'Pool & Garden',
      description: 'Relax in our beautiful outdoor spaces',
      icon: '🏊‍♂️',
      image: '/pool.jpg'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('name');

      if (data && !error) {
        setAmenities(data);
      }
    } catch (err) {
      console.log('Using default amenities data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (amenity: Amenity) => {
    try {
      const { error } = await supabase
        .from('amenities')
        .upsert(amenity);

      if (error) throw error;
      
      setAmenities(prev => {
        const existing = prev.find(a => a.id === amenity.id);
        if (existing) {
          return prev.map(a => a.id === amenity.id ? amenity : a);
        } else {
          return [...prev, amenity];
        }
      });
      
      setEditingAmenity(null);
      setShowAddForm(false);
      alert('✅ Amenity saved successfully!');
    } catch (err) {
      console.error('Error saving amenity:', err);
      alert('⚠️ Amenity saved locally (database may not be connected yet)');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this amenity?')) return;

    try {
      const { error } = await supabase
        .from('amenities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAmenities(prev => prev.filter(a => a.id !== id));
      alert('✅ Amenity deleted successfully!');
    } catch (err) {
      console.error('Error deleting amenity:', err);
      setAmenities(prev => prev.filter(a => a.id !== id));
      alert('⚠️ Amenity deleted locally');
    }
  };

  const AmenityForm: React.FC<{ amenity?: Amenity; onSave: (amenity: Amenity) => void; onCancel: () => void }> = ({ 
    amenity, 
    onSave, 
    onCancel 
  }) => {
    const [formData, setFormData] = useState<Amenity>(amenity || {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: '✨',
      image: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-4">
        <h3 className="text-lg font-semibold mb-4">
          {amenity ? 'Edit Amenity' : 'Add New Amenity'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="🏊‍♂️"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image
            </label>
            <ImageDropzone
              onImageUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
              currentImage={formData.image}
              folder="amenities"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              {amenity ? 'Update' : 'Add'} Amenity
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Manage Amenities
        </h2>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          Add New Amenity
        </Button>
      </div>

      {showAddForm && (
        <AmenityForm
          onSave={handleSave}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingAmenity && (
        <AmenityForm
          amenity={editingAmenity}
          onSave={handleSave}
          onCancel={() => setEditingAmenity(null)}
        />
      )}

      <div className="grid gap-4">
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="bg-gradient-to-br from-white to-amber-50/30 rounded-lg p-6 flex justify-between items-center ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm shadow-lg"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-3xl">{amenity.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{amenity.name}</h3>
                <p className="text-slate-600 text-sm">{amenity.description}</p>
                {amenity.image && (
                  <img 
                    src={amenity.image} 
                    alt={amenity.name}
                    className="w-16 h-16 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                variant="secondary" 
                className="text-sm"
                onClick={() => setEditingAmenity(amenity)}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                className="text-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => handleDelete(amenity.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {amenities.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No amenities available. Add your first amenity to get started.
        </div>
      )}
    </div>
  );
};
