import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ImageDropzone } from '../ui/ImageDropzone';

interface Event {
  id: string;
  title: string;
  date: string;
  category?: string;
  description: string;
  image: string;
}

interface EditEventModalProps {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ event, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<Event>(event);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      console.log('🔧 Form submission blocked - save in progress');
      return;
    }
    console.log('🔧 Event form submitted with data:', formData);
    onSave(formData);
  };

  const handleChange = (field: keyof Event, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="p-8 bg-gradient-to-br from-white to-amber-50/50">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">Edit Event</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Wine Tasting, Live Music"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Event Image</label>
            <ImageDropzone
              currentImage={formData.image}
              onImageUpload={(imageUrl) => handleChange('image', imageUrl)}
              label="Drag & drop your event image here, or click to browse"
              folder="events"
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
