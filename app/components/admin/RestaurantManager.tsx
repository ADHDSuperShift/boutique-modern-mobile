'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

interface RestaurantData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  backgroundImage: string;
  menuSections: MenuSection[];
}

interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

export const RestaurantManager: React.FC = () => {
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    title: 'Gourmet Restaurant',
    subtitle: 'Farm-to-Table Excellence',
    description: 'Our award-winning restaurant showcases the finest local ingredients, paired perfectly with our estate wines.',
    features: [
      'Farm-to-table cuisine',
      'Award-winning chef',
      'Wine pairing menus',
      'Private dining available'
    ],
    backgroundImage: '/restaurant-bg.jpg',
    menuSections: [
      {
        id: '1',
        name: 'Starters',
        items: [
          {
            id: '1',
            name: 'Burrata with Local Tomatoes',
            description: 'Fresh burrata cheese with heirloom tomatoes and basil oil',
            price: 'R185'
          }
        ]
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMenuSection, setEditingMenuSection] = useState<MenuSection | null>(null);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_info')
        .select('*')
        .single();

      if (data && !error) {
        setRestaurantData(data);
      }
    } catch (err) {
      console.log('Using default restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: restaurantData.title,
        subtitle: restaurantData.subtitle,
        description: restaurantData.description,
        features: restaurantData.features,
        backgroundImage: restaurantData.backgroundImage,
        menuSections: restaurantData.menuSections,
      } as const;

      const res = await fetch('/api/admin/restaurant/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: restaurantData.id || 'restaurant', ...payload })
      });
      if (!res.ok) {
        console.warn('Restaurant upsert failed:', await res.json());
        alert('⚠️ Restaurant info updated locally (database may not be connected yet)');
      } else {
        alert('✅ Restaurant information updated successfully!');
      }
    } catch (err) {
  console.error('Error updating restaurant info:', err);
  alert('⚠️ Restaurant info updated locally (database may not be connected yet)');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof RestaurantData, value: any) => {
    setRestaurantData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setRestaurantData(prev => ({
      ...prev,
      backgroundImage: imageUrl
    }));
  };

  const addFeature = () => {
    const newFeature = prompt('Enter new feature:');
    if (newFeature) {
      setRestaurantData(prev => ({
        ...prev,
        features: [...prev.features, newFeature]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setRestaurantData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addMenuSection = () => {
    const sectionName = prompt('Enter menu section name:');
    if (sectionName) {
      const newSection: MenuSection = {
        id: Date.now().toString(),
        name: sectionName,
        items: []
      };
      setRestaurantData(prev => ({
        ...prev,
        menuSections: [...prev.menuSections, newSection]
      }));
    }
  };

  const removeMenuSection = (sectionId: string) => {
    if (confirm('Are you sure you want to remove this menu section?')) {
      setRestaurantData(prev => ({
        ...prev,
        menuSections: prev.menuSections.filter(s => s.id !== sectionId)
      }));
    }
  };

  const addMenuItem = (sectionId: string) => {
    const name = prompt('Enter item name:');
    if (!name) return;
    
    const description = prompt('Enter item description:');
    if (!description) return;
    
    const price = prompt('Enter item price (e.g. R150):');
    if (!price) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name,
      description,
      price
    };

    setRestaurantData(prev => ({
      ...prev,
      menuSections: prev.menuSections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    }));
  };

  const removeMenuItem = (sectionId: string, itemId: string) => {
    if (confirm('Are you sure you want to remove this menu item?')) {
      setRestaurantData(prev => ({
        ...prev,
        menuSections: prev.menuSections.map(section =>
          section.id === sectionId
            ? { ...section, items: section.items.filter(item => item.id !== itemId) }
            : section
        )
      }));
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Restaurant Manager
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
          <h3 className="text-xl font-semibold mb-4">Restaurant Information</h3>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={restaurantData.title}
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
                value={restaurantData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={restaurantData.description}
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
                currentImage={restaurantData.backgroundImage}
                folder="restaurant"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Features</h3>
            <Button variant="secondary" onClick={addFeature}>
              Add Feature
            </Button>
          </div>
          
          <div className="space-y-2">
            {restaurantData.features.map((feature, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <span>{feature}</span>
                <Button 
                  variant="outline" 
                  className="text-sm text-red-600"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl shadow-lg ring-1 ring-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Menu Sections</h3>
            <Button variant="secondary" onClick={addMenuSection}>
              Add Menu Section
            </Button>
          </div>
          
          <div className="space-y-4">
            {restaurantData.menuSections.map((section) => (
              <div key={section.id} className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">{section.name}</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="text-sm"
                      onClick={() => addMenuItem(section.id)}
                    >
                      Add Item
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-sm text-red-600"
                      onClick={() => removeMenuSection(section.id)}
                    >
                      Remove Section
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{item.name}</h5>
                          <span className="font-semibold text-amber-600">{item.price}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="text-xs text-red-600 ml-2"
                        onClick={() => removeMenuItem(section.id, item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  {section.items.length === 0 && (
                    <p className="text-slate-500 text-sm italic">No items in this section</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
