import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface Room {
  id: string;
  name: string;
  type: string;
  shortDesc: string;
  price?: number;
  image: string;
}

interface EditRoomModalProps {
  room: Room;
  onSave: (room: Room) => void;
  onCancel: () => void;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({ room, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Room>(room);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Room, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
