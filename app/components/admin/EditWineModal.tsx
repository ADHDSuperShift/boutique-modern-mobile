'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

interface Wine {
  id: string;
  name: string;
  region: string;
  vintage: string;
  price?: number;
  image: string;
}

interface EditWineModalProps {
  wine: Wine | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (wine: Wine) => void;
}

export const EditWineModal: React.FC<EditWineModalProps> = ({ 
  wine, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Wine>(
    wine || {
      id: '',
      name: '',
      region: '',
      vintage: '',
      price: 0,
      image: ''
    }
  );

  React.useEffect(() => {
    if (wine) {
      setFormData(wine);
    }
  }, [wine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof Wine, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !wine) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-lg p-6 max-w-md w-full mx-4 ring-1 ring-slate-200">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
          Edit Wine
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Wine Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Region
            </label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vintage
            </label>
            <input
              type="text"
              value={formData.vintage}
              onChange={(e) => handleInputChange('vintage', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm"
              placeholder="e.g., 2019"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price (optional)
            </label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 backdrop-blur-sm"
              placeholder="e.g., 450"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Wine Bottle Image</label>
            <ImageDropzone
              currentImage={formData.image}
              onImageUpload={(imageUrl) => handleInputChange('image', imageUrl)}
              label="Drag & drop your wine bottle image here, or click to browse"
              folder="wines"
            />
            
            {/* Fallback URL input for manual entry */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-500 mb-1">Or enter image URL manually:</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/wine-bottle.jpg"
                className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 bg-white/80"
              />
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image Preview
              </label>
              <div className="flex justify-center">
                <div className="relative w-20 h-20">
                  <Image 
                    src={formData.image} 
                    alt="Wine preview"
                    fill
                    sizes="80px"
                    className="object-contain rounded-lg bg-white ring-1 ring-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
