'use client';

import React, { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageDropzoneProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
  folder?: string; // NEW: organize by folder (rooms/, events/, wines/)
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageUpload,
  currentImage,
  label = "Drop image here or click to browse",
  className = "",
  folder = "general" // Default folder
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('❌ Please upload an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('❌ Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a unique filename with folder organization
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      console.log('🔧 Uploading image to universal storage:', fileName);
      
      // Upload to Supabase Storage (universal bucket)
      const { data, error } = await supabase.storage
        .from('site-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Supabase Storage error:', error.message);
        // Fallback to preview URL for demo
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        onImageUpload(previewUrl);
        alert('⚠️ Storage bucket not ready yet - using preview. Check MANUAL_FIX.md');
        return;
      }

      // Get public URL for the uploaded image
      const { data: publicData } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;
      console.log('✅ Image uploaded successfully to storage:', publicUrl);
      
      setPreview(publicUrl);
      onImageUpload(publicUrl);
      
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      // Fallback to preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageUpload(previewUrl);
      alert('⚠️ Using preview image (upload failed)');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  return (
    <div className={`relative ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-amber-400 bg-amber-50 scale-105' 
            : 'border-slate-300 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/50'
          }
          ${isUploading ? 'opacity-75 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-32 rounded-lg shadow-md"
            />
            <p className="text-sm text-slate-600">
              📸 Image ready! Drop a new one to replace
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {isUploading ? (
              <div className="animate-spin mx-auto w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"></div>
            ) : (
              <svg 
                className="mx-auto w-12 h-12 text-slate-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 48 48"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                />
              </svg>
            )}
            
            <div>
              <p className="text-lg font-medium text-slate-700">
                {isUploading ? 'Uploading...' : '📸 Drop your image here'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {label}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Supports: JPG, PNG, GIF • Max size: 5MB
              </p>
            </div>
          </div>
        )}
        
        {isDragging && (
          <div className="absolute inset-0 bg-amber-200/20 rounded-lg flex items-center justify-center">
            <p className="text-amber-800 font-semibold text-lg">
              🎯 Drop it like it's hot!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
