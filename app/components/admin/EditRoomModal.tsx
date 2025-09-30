import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ImageDropzone } from '../ui/ImageDropzone';

interface Room {
  id: string;
  name: string;
  type: string;
  shortDesc: string;
  description?: string;
  amenities?: string[];
  price?: number;
  image: string;
  images?: string[];
}

interface EditRoomModalProps {
  room: Room;
  onSave: (room: Room) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({ room, onSave, onCancel, isLoading = false }) => {
  console.log('🔧 EditRoomModal rendering with room:', room);
  
  const [formData, setFormData] = useState<Room>(room);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      console.log('🔧 Form submission blocked - save in progress');
      return;
    }
    console.log('🔧 Form submitted with data:', formData);
    onSave(formData);
  };

  const handleChange = (field: keyof Room, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), imageUrl]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="p-8 bg-gradient-to-br from-white to-amber-50/50">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">Edit Room</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Room Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Room Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="Standard Room">Standard Room</option>
              <option value="Deluxe Room">Deluxe Room</option>
              <option value="Suite">Suite</option>
              <option value="Family Room">Family Room</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              required
              value={formData.shortDesc}
              onChange={(e) => handleChange('shortDesc', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price per Night (R)</label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value ? parseInt(e.target.value) : 0)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Room Image</label>
            <ImageDropzone
              currentImage={formData.image}
              onImageUpload={(imageUrl) => handleChange('image', imageUrl)}
              label="Drag & drop your room image here, or click to browse"
              folder="rooms"
            />
            
            {/* Fallback URL input for manual entry */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-500 mb-1">Or enter image URL manually:</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 bg-white/80"
              />
            </div>
          </div>

          {/* Additional Images Gallery */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Additional Images (Gallery)</label>
            
            {/* Existing gallery images */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add new image */}
            <ImageDropzone
              onImageUpload={handleAddImage}
              label="Add more room photos to gallery"
              className="border-dashed border-slate-300"
              folder="rooms"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
