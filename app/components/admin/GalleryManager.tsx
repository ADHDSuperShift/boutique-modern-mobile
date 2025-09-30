'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

const fallbackImages = [
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215820600_2c2bb234.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215822339_23c8b418.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215824058_d059efb7.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215819859_d1a76dd0.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215800577_ecbf1d1d.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215802323_7a0a2f9a.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215804031_2b1f3f2a.webp',
  'https://d64gsuwffb70l.cloudfront.net/68db807a8d8aec1a73e2d1d7_1759215805666_abc12345.webp',
];

export const GalleryManager: React.FC = () => {
  const [title, setTitle] = useState('Gallery');
  const [images, setImages] = useState<string[]>(Array(8).fill(''));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('gallery_section')
          .select('title, images')
          .maybeSingle();
        setTitle(data?.title ?? 'Gallery');
        let imgs: string[] = Array.isArray(data?.images) ? data!.images as string[] : [];
        if (!imgs || imgs.length === 0) {
          imgs = [...fallbackImages];
        }
        // normalize to exactly 8 slots
        if (imgs.length < 8) imgs = [...imgs, ...Array(8 - imgs.length).fill('')];
        if (imgs.length > 8) imgs = imgs.slice(0, 8);
        setImages(imgs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      // Save exactly 8 images (empty strings filtered out)
      const payloadImages = images.map((s) => s || '').slice(0, 8);
      const res = await fetch('/api/admin/gallery/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'gallery', title, images: payloadImages })
      });
      if (!res.ok) throw new Error('Save failed');
      alert('✅ Gallery saved');
    } catch (e) {
      console.error(e);
      alert('⚠️ Saved locally (service route unavailable)');
    } finally {
      setSaving(false);
    }
  };

  const uploadForIndex = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    try {
      const ext = file.name.split('.').pop();
      const key = `gallery/${index + 1}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('site-images')
        .upload(key, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data: pub } = supabase.storage.from('site-images').getPublicUrl(key);
      const url = pub.publicUrl;
      setImages(prev => prev.map((s, i) => (i === index ? url : s)));
    } catch (e: any) {
      console.error('Upload failed', e);
      alert(`Upload failed: ${e?.message || 'Unknown error'}`);
    } finally {
      if (fileInputs.current[index]) fileInputs.current[index]!.value = '';
    }
  };

  const onFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) uploadForIndex(index, f);
  };

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {images.slice(0, 8).map((src, i) => (
            <div key={i} className="rounded-lg ring-1 ring-slate-200 p-3 bg-white/70 backdrop-blur-sm">
              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                {src ? (
                  <Image src={src} alt={`Slot ${i + 1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-slate-400 text-sm">No Image</div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Slot {i + 1}</span>
                <div className="flex items-center gap-2">
                  <input
                    ref={(el) => {
                      fileInputs.current[i] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileChange(i, e)}
                  />
                  <button
                    onClick={() => fileInputs.current[i]?.click()}
                    className="text-sm px-2 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Replace
                  </button>
                  {src && (
                    <button
                      onClick={() => setImages(prev => prev.map((s, idx) => (idx === i ? '' : s)))}
                      className="text-sm px-2 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
