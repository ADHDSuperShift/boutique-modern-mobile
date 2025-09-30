'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { events as staticEvents } from '../../data/events';
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

interface Event {
  id: string;
  title: string;
  date: string;
  category?: string;
  description: string;
  image: string;
}

interface SortableEventItemProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const SortableEventItem: React.FC<SortableEventItemProps> = ({ event, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

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
          src={event.image} 
          alt={event.title}
          className="w-20 h-20 object-cover rounded-lg ring-1 ring-slate-200"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 mb-1">{event.title}</h3>
          <p className="text-slate-600 mb-1">{event.category}</p>
          <p className="text-amber-600 font-semibold">
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button 
          variant="secondary" 
          className="text-sm"
          onClick={() => onEdit(event)}
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          className="text-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          onClick={() => onDelete(event.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Try to fetch from Supabase, but fallback to static data
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        // Fallback to static data if Supabase fails
        setEvents(staticEvents);
      } else {
        setEvents(data || staticEvents);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      // Fallback to static data
      setEvents(staticEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setEvents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      // For demo purposes, remove from local state
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleSaveEdit = async (updatedEvent: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', updatedEvent.id);

      if (error) throw error;
      
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      setEditingEvent(null);
    } catch (err) {
      console.error('Error updating event:', err);
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      setEditingEvent(null);
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Manage Events</h2>
        <Button variant="primary">Add New Event</Button>
      </div>

      <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          💡 <strong>Drag and Drop:</strong> Use the grip icon (⋮⋮) to reorder events by dragging them up or down.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={events.map(event => event.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {events.map((event) => (
              <SortableEventItem
                key={event.id}
                event={event}
                onEdit={handleEdit}
                onDelete={deleteEvent}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {events.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No events available. Add your first event to get started.
        </div>
      )}

      {/* Edit Modal Placeholder */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Edit Event: {editingEvent.title}</h3>
            <p className="text-slate-600 mb-4">Edit functionality coming soon...</p>
            <Button onClick={() => setEditingEvent(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

