'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { rooms as staticRooms } from '../../data/rooms';
import { EditRoomModal } from './EditRoomModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface SortableRoomItemProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  editingRoom: Room | null;
}

const SortableRoomItem: React.FC<SortableRoomItemProps> = ({ room, onEdit, onDelete, editingRoom }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: room.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gradient-to-br from-white to-amber-50/30 rounded-lg p-6 flex justify-between items-center ring-1 ring-slate-200 hover:ring-amber-300 transition-all duration-300 backdrop-blur-sm ${
        isDragging ? 'shadow-xl z-10' : 'shadow-lg'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-amber-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 mb-1">{room.name}</h3>
          <p className="text-slate-600 mb-2">{room.type}</p>
          <p className="text-sm text-slate-500 line-clamp-2">{room.shortDesc}</p>
          {room.price && (
            <p className="text-amber-600 font-semibold mt-2">R{room.price}/night</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button 
          variant="secondary" 
          className={`text-sm transition-all duration-200 ${editingRoom?.id === room.id ? 'bg-amber-100 border-amber-300' : ''}`}
          onClick={() => onEdit(room)}
          disabled={!!editingRoom}
        >
          {editingRoom?.id === room.id ? 'Editing...' : 'Edit'}
        </Button>
        <Button 
          variant="outline" 
          className="text-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          onClick={() => onDelete(room.id)}
          disabled={!!editingRoom}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export const RoomsManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Try to fetch from Supabase, but fallback to static data
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');

      if (error) {
        // Fallback to static data if Supabase fails
        setRooms(staticRooms);
      } else {
        setRooms(data || staticRooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      // Fallback to static data
      setRooms(staticRooms);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setRooms((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Here you could update the order in Supabase
        // updateRoomOrder(newOrder);
        
        return newOrder;
      });
    }
  };

  const deleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
      // For demo purposes, remove from local state
      setRooms(prev => prev.filter(room => room.id !== id));
    }
  };

  const handleEdit = (room: Room) => {
    console.log('🔧 Opening edit modal for room:', room);
    console.log('🔧 Current editingRoom state:', editingRoom);
    
    // Ensure we create a fresh copy to avoid reference issues
    const roomCopy = { ...room };
    setEditingRoom(roomCopy);
  };

  const handleSaveEdit = async (updatedRoom: Room) => {
    if (isModalLoading) {
      console.log('🔧 Save already in progress, ignoring...');
      return;
    }
    
    setIsModalLoading(true);
    console.log('🔧 Saving room:', updatedRoom);
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update(updatedRoom)
        .eq('id', updatedRoom.id);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Room updated successfully in database');
      
      // Update local state
      setRooms(prev => prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      ));
      setEditingRoom(null);
      
      alert('✅ Room updated successfully!');
    } catch (err) {
      console.error('❌ Error updating room:', err);
      
      // Still update local state for demo purposes
      setRooms(prev => prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      ));
      setEditingRoom(null);
      
      alert('⚠️ Room updated locally (database may not be connected yet)');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCancelEdit = () => {
    console.log('🔧 Canceling edit...');
    setEditingRoom(null);
    setIsModalLoading(false);
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Manage Rooms</h2>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>Add New Room</Button>
      </div>

      <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          💡 <strong>Drag and Drop:</strong> Use the grip icon (⋮⋮) to reorder rooms by dragging them up or down.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={rooms.map(room => room.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {rooms.map((room) => (
              <SortableRoomItem
                key={room.id}
                room={room}
                onEdit={handleEdit}
                onDelete={deleteRoom}
                editingRoom={editingRoom}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {rooms.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No rooms available. Add your first room to get started.
        </div>
      )}

      {/* Edit Modal */}
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          isLoading={isModalLoading}
        />
      )}
    </div>
  );
};
