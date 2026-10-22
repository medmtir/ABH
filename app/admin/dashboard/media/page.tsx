'use client';

import React, { useState, useEffect } from 'react';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Copy, Check, Trash2, Image as ImageIcon, FileText } from 'lucide-react';

export default function AdminMediaPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFiles = () => {
    setLoading(true);
    fetch('/api/admin/upload')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFiles(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
          Médiathèque & Gestion des Documents
        </h1>
        <p className="text-xs text-abh-slate mt-0.5">
          Téléversez des photos d usines, logos, fiches de spécifications ou bulletins d analyses.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs">
        <h3 className="text-sm font-bold text-abh-sapphire mb-3">Téléverser un Nouveau Média</h3>
        <ImageUploader
          label=""
          onUploadSuccess={() => fetchFiles()}
        />
      </div>

      {/* Files Grid */}
      <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-abh-sapphire">
            Fichiers Disponibles ({files.length})
          </h3>
          <button
            onClick={fetchFiles}
            className="text-xs font-semibold text-abh-amber hover:underline"
          >
            Actualiser
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-abh-slate">Chargement des médias...</div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-xs text-abh-slate">
            Aucun média téléversé pour le moment dans /public/uploads.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-xl border border-abh-border overflow-hidden bg-abh-pearl/30 text-xs flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden">
                  {f.name.endsWith('.pdf') ? (
                    <FileText className="h-10 w-10 text-red-500" />
                  ) : (
                    <img
                      src={f.url}
                      alt={f.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-2 space-y-1">
                  <p className="font-mono text-[10px] text-abh-midnight truncate" title={f.name}>
                    {f.name}
                  </p>
                  <p className="text-[9px] text-gray-400">{f.size}</p>

                  <button
                    type="button"
                    onClick={() => handleCopy(f.url)}
                    className="w-full mt-1 flex items-center justify-center gap-1 rounded-lg bg-abh-sapphire/10 hover:bg-abh-sapphire hover:text-white p-1 text-[10px] font-semibold text-abh-sapphire transition-colors"
                  >
                    {copiedUrl === f.url ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copier URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
