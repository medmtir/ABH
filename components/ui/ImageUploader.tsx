'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
  label?: string;
}

export function ImageUploader({
  onUploadSuccess,
  defaultImage = '',
  label = 'Téléverser une image',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(defaultImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erreur lors du téléversement');
      }

      const data = await res.json();
      setPreview(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || 'Impossible de téléverser l image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUploadSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-abh-midnight">{label}</label>}

      {preview ? (
        <div className="relative group overflow-hidden rounded-xl border border-abh-border bg-abh-pearl/30 aspect-video max-h-48 w-full flex items-center justify-center">
          <img src={preview} alt="Aperçu" className="max-h-full max-w-full object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700 transition-colors"
            title="Supprimer l image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-abh-border hover:border-abh-amber bg-white cursor-pointer transition-colors"
        >
          <UploadCloud className="h-8 w-8 text-abh-slate mb-2" />
          <span className="text-xs font-medium text-abh-midnight">Cliquez pour sélectionner un fichier</span>
          <span className="text-[10px] text-abh-slate mt-1">PNG, JPG, WEBP, SVG (Max 10 Mo)</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading && (
        <div className="flex items-center gap-2 text-xs text-abh-amber">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-abh-amber border-t-transparent" />
          <span>Téléversement et vérification Magic Bytes en cours...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
