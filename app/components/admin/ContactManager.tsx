'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

interface ContactData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  backgroundImage: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export const ContactManager: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData>({
    title: 'Contact Us',
    subtitle: 'Get in Touch',
    description: 'We would love to hear from you. Contact us for reservations, inquiries, or just to say hello.',
    address: '123 Wine Estate Road, Stellenbosch, Western Cape, South Africa',
    phone: '+27 21 123 4567',
    email: 'hello@boutique-hotel.com',
    hours: 'Open daily: 8:00 AM - 10:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.2...',
    backgroundImage: '/contact-bg.jpg',
    socialLinks: {
      facebook: 'https://facebook.com/boutiquehotel',
      instagram: 'https://instagram.com/boutiquehotel',
      twitter: 'https://twitter.com/boutiquehotel',
      youtube: 'https://youtube.com/boutiquehotel'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (data && !error) {
        setContactData(data);
      }
    } catch (err) {
      console.log('Using default contact data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_info')
        .upsert(contactData);

      if (error) throw error;
      alert('✅ Contact information updated successfully!');
    } catch (err) {
      console.error('Error updating contact info:', err);
      alert('⚠️ Contact info updated locally (database may not be connected yet)');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ContactData, value: any) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof ContactData['socialLinks'], value: string) => {
    setContactData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setContactData(prev => ({
      ...prev,
      backgroundImage: imageUrl
    }));
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Contact Information Manager
        </h2>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={contactData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={contactData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={contactData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Background Image
              </label>
              <ImageDropzone
                onImageUpload={handleImageUpload}
                currentImage={contactData.backgroundImage}
                folder="contact"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                value={contactData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Operating Hours
              </label>
              <input
                type="text"
                value={contactData.hours}
                onChange={(e) => handleChange('hours', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="e.g., Open daily: 8:00 AM - 10:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Google Maps Embed URL
              </label>
              <textarea
                value={contactData.mapEmbedUrl}
                onChange={(e) => handleChange('mapEmbedUrl', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Paste Google Maps embed URL here..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Get this from Google Maps → Share → Embed a map → Copy HTML
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Social Media Links</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={contactData.socialLinks.facebook || ''}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={contactData.socialLinks.instagram || ''}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={contactData.socialLinks.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="https://twitter.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                YouTube
              </label>
              <input
                type="url"
                value={contactData.socialLinks.youtube || ''}
                onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          <div className="bg-slate-100 p-4 rounded-lg">
            <h4 className="text-lg font-bold">{contactData.title}</h4>
            <p className="text-slate-600 mb-2">{contactData.subtitle}</p>
            <p className="text-sm mb-4">{contactData.description}</p>
            
            <div className="text-sm space-y-1">
              <p><strong>Address:</strong> {contactData.address}</p>
              <p><strong>Phone:</strong> {contactData.phone}</p>
              <p><strong>Email:</strong> {contactData.email}</p>
              <p><strong>Hours:</strong> {contactData.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
