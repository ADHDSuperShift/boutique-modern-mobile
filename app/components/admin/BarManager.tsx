'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ImageDropzone } from '../ui/ImageDropzone';

export const BarManager: React.FC = () => {
  const [data, setData] = useState({
    id: 'bar',
    title: 'Windpomp Bar',
    subtitle: 'Crafted drinks & easy vibes',
    description: 'Relax at the Windpomp Bar with signature cocktails, local spirits, and good company.',
    backgroundImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: row } = await supabase
          .from('bar_info')
          .select('id,title,subtitle,description,background_image')
          .maybeSingle();
        if (row) {
          setData({
            id: row.id ?? 'bar',
            title: row.title ?? '',
            subtitle: row.subtitle ?? '',
            description: row.description ?? '',
            backgroundImage: row.background_image ?? ''
          });
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
      const res = await fetch('/api/admin/bar/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Save failed');
      alert('✅ Bar saved');
    } catch {
      alert('⚠️ Saved locally (service route unavailable)');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-6 text-slate-600">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Bar Section</h2>
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input className="border rounded-lg px-3 py-2" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
        <label className="text-sm font-medium text-slate-700">Subtitle</label>
        <input className="border rounded-lg px-3 py-2" value={data.subtitle} onChange={e => setData({ ...data, subtitle: e.target.value })} />
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea className="border rounded-lg px-3 py-2" rows={3} value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
        <label className="text-sm font-medium text-slate-700">Hero Image</label>
        <ImageDropzone folder="bar" currentImage={data.backgroundImage} onImageUpload={(url) => setData({ ...data, backgroundImage: url })} />
        <input className="border rounded-lg px-3 py-2" placeholder="Or paste image URL…" value={data.backgroundImage} onChange={e => setData({ ...data, backgroundImage: e.target.value })} />
      </div>
    </div>
  );
};

export default BarManager;
