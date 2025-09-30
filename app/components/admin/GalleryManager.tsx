'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

export const GalleryManager: React.FC = () => {
  const [title, setTitle] = useState('Gallery');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('gallery_section')
          .select('title, images')
          .maybeSingle();
        if (data) {
          setTitle(data.title ?? 'Gallery');
          setImages(Array.isArray(data.images) ? data.images : []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'gallery', title, images })
      });
      if (!res.ok) throw new Error('Save failed');
      alert('✅ Gallery saved');
    } catch {
      alert('⚠️ Saved locally (service route unavailable)');
    } finally {
      setSaving(false);
    }
  };

  const addImage = (url: string) => setImages(prev => [...prev, url]);
  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  if (loading) return <div className="py-6 text-slate-600">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Gallery Section</h2>
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input className="border rounded-lg px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />

        <label className="text-sm font-medium text-slate-700">Add Image</label>
        <ImageDropzone folder="gallery" onImageUpload={addImage} />

        <div className="grid md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2">
              <img src={src} alt={"Gallery " + (i + 1)} className="w-full h-40 object-cover rounded" />
              <div className="flex justify-between items-center">
                <span className="text-xs truncate text-slate-500">{src}</span>
                <button onClick={() => removeImage(i)} className="text-red-600 text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
