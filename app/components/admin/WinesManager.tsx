'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { wines as staticWines } from '../../data/wines';
import { EditWineModal } from './EditWineModal';
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

interface Wine {
  id: string;
  name: string;
  region: string;
  vintage: string;
  price?: number;
  image: string;
}

interface SortableWineItemProps {
  wine: Wine;
  onEdit: (wine: Wine) => void;
  onDelete: (id: string) => void;
}

const SortableWineItem: React.FC<SortableWineItemProps> = ({ wine, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: wine.id });

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
        
        <img 
          src={wine.image} 
          alt={wine.name}
          className="w-16 h-16 object-contain rounded-lg bg-white ring-1 ring-slate-200"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 mb-1">{wine.name}</h3>
          <p className="text-slate-600 mb-1">{wine.region}</p>
          <p className="text-amber-600 font-semibold">{wine.vintage}</p>
          {wine.price && (
            <p className="text-slate-700 font-medium mt-1">R{wine.price}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button 
          variant="secondary" 
          className="text-sm"
          onClick={() => onEdit(wine)}
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          className="text-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          onClick={() => onDelete(wine.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export const WinesManager: React.FC = () => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchWines();
  }, []);

  const fetchWines = async () => {
    try {
      // Try to fetch from Supabase, but fallback to static data
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .order('name');

      if (error) {
        // Fallback to static data if Supabase fails
        setWines(staticWines);
      } else {
        setWines(data || staticWines);
      }
    } catch (err) {
      console.error('Error fetching wines:', err);
      // Fallback to static data
      setWines(staticWines);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWines((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const deleteWine = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wine?')) return;

    try {
      const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchWines();
    } catch (err) {
      console.error('Error deleting wine:', err);
      // For demo purposes, remove from local state
      setWines(prev => prev.filter(wine => wine.id !== id));
    }
  };

  const handleEdit = (wine: Wine) => {
    setEditingWine(wine);
  };

  const handleSaveEdit = async (updatedWine: Wine) => {
    try {
      const { error } = await supabase
        .from('wines')
        .update(updatedWine)
        .eq('id', updatedWine.id);

      if (error) throw error;
      
      setWines(prev => prev.map(wine => 
        wine.id === updatedWine.id ? updatedWine : wine
      ));
      setEditingWine(null);
    } catch (err) {
      console.error('Error updating wine:', err);
      setWines(prev => prev.map(wine => 
        wine.id === updatedWine.id ? updatedWine : wine
      ));
      setEditingWine(null);
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Manage Wines</h2>
        <Button variant="primary">Add New Wine</Button>
      </div>

      <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          💡 <strong>Drag and Drop:</strong> Use the grip icon (⋮⋮) to reorder wines by dragging them up or down.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={wines.map(wine => wine.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {wines.map((wine) => (
              <SortableWineItem
                key={wine.id}
                wine={wine}
                onEdit={handleEdit}
                onDelete={deleteWine}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {wines.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No wines available. Add your first wine to get started.
        </div>
      )}

      {/* Edit Modal */}
      <EditWineModal
        wine={editingWine}
        isOpen={!!editingWine}
        onClose={() => setEditingWine(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

 
