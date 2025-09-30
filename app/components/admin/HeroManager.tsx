'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

interface HeroData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export const HeroManager: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'Luxury Boutique Hotel & Wine Estate',
    subtitle: 'Experience Elegance in the Heart of Wine Country',
    description: 'Indulge in world-class accommodations, exquisite dining, and award-winning wines at our exclusive boutique retreat.',
    backgroundImage: '/hero-bg.jpg',
    ctaText: 'Book Your Stay',
    ctaLink: '#rooms'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .single();

      if (data && !error) {
        setHeroData(data);
      }
    } catch (err) {
      console.log('Using default hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: heroData.title,
        subtitle: heroData.subtitle,
        description: heroData.description,
        backgroundImage: heroData.backgroundImage,
        ctaText: heroData.ctaText,
        ctaLink: heroData.ctaLink,
      } as const;

      const res = await fetch('/api/admin/hero/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: heroData.id || 'hero', ...payload })
      });
      if (!res.ok) {
        console.warn('Hero upsert failed:', await res.json());
        alert('⚠️ Hero section updated locally (database may not be connected yet)');
      } else {
        alert('✅ Hero section updated successfully!');
      }
    } catch (err) {
  console.error('Error updating hero section:', err);
  alert('⚠️ Hero section updated locally (database may not be connected yet)');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HeroData, value: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setHeroData(prev => ({
      ...prev,
      backgroundImage: imageUrl
    }));
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Hero Section Editor
        </h2>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
        <div className="grid gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter main title..."
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={heroData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter subtitle..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={heroData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter description..."
            />
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Background Image
            </label>
            <ImageDropzone
              onImageUpload={handleImageUpload}
              currentImage={heroData.backgroundImage}
              folder="hero"
            />
            <input
              type="text"
              value={heroData.backgroundImage}
              onChange={(e) => handleChange('backgroundImage', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent mt-2"
              placeholder="Or enter image URL manually..."
            />
          </div>

          {/* CTA Button */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={heroData.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Button text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Call-to-Action Link
              </label>
              <input
                type="text"
                value={heroData.ctaLink}
                onChange={(e) => handleChange('ctaLink', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Button link..."
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Preview:</h3>
            <div 
              className="relative h-48 rounded-lg overflow-hidden bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative text-center text-white">
                <h1 className="text-2xl font-bold mb-2">{heroData.title}</h1>
                <p className="text-lg mb-1">{heroData.subtitle}</p>
                <p className="text-sm mb-4 opacity-90">{heroData.description}</p>
                <button className="bg-amber-500 text-white px-4 py-2 rounded-lg">
                  {heroData.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
