import { useState, useEffect, useCallback, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

// ── Types ──
interface DocRecord {
  id: number;
  user_id: number;
  filename: string;
  original_name: string;
  category: string;
  summary: string | null;
  file_type: string;
  file_size: number;
  key_details: string;
  ai_processed: number;
  created_at: string;
}

type ViewMode = 'grid' | 'timeline';

const CATEGORIES = [
  { value: 'all', label: 'All', color: 'bg-stone-100 text-stone-700' },
  { value: 'financial', label: 'Financial', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'employment', label: 'Employment', color: 'bg-blue-100 text-blue-700' },
  { value: 'housing', label: 'Housing', color: 'bg-amber-100 text-amber-700' },
  { value: 'legal', label: 'Legal', color: 'bg-red-100 text-red-700' },
  { value: 'healthcare', label: 'Healthcare', color: 'bg-pink-100 text-pink-700' },
  { value: 'identification', label: 'ID', color: 'bg-purple-100 text-purple-700' },
  { value: 'tax', label: 'Tax', color: 'bg-orange-100 text-orange-700' },
  { value: 'insurance', label: 'Insurance', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'education', label: 'Education', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'correspondence', label: 'Correspondence', color: 'bg-gray-100 text-gray-700' },
  { value: 'other', label: 'Other', color: 'bg-stone-100 text-stone-700' },
] as const;

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.webp,.txt,.eml,.doc,.docx';
const ACCEPTED_LABELS = 'PDF, JPG, PNG, WEBP, TXT, EML, DOC, DOCX';

function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return '🖼';
  if (fileType === 'application/pdf') return '📄';
  if (fileType === 'text/plain' || fileType === 'message/rfc822') return '📝';
  if (fileType.includes('word')) return '📃';
  return '📎';
}

function getFileSizeDisplay(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'Z');
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getToken(): string | null {
  return localStorage.getItem('lifectrl_token');
}

// ── Component ──
export default function DocumentStudio() {
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingDoc, setEditingDoc] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch documents ──
  const fetchDocs = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setError('');

    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());

    try {
      const res = await fetch(`/api/docs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) {
        setDocs(json.data);
      } else {
        setError(json.error || 'Failed to load documents');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // ── Upload handler ──
  const uploadFiles = async (files: FileList | File[]) => {
    const token = getToken();
    if (!token || files.length === 0) return;

    setUploading(true);
    setError('');
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(`Uploading ${i + 1} of ${fileArray.length}: ${file.name}`);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/docs/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const json = await res.json();
        if (!json.ok) {
          setError(`Upload failed for ${file.name}: ${json.error}`);
        } else {
          setUploadProgress(`AI analyzing "${file.name}"...`);
        }
      } catch {
        setError(`Upload failed for ${file.name}`);
      }
    }

    setUploading(false);
    setUploadProgress('');
    await fetchDocs();
  };

  // ── Delete handler ──
  const deleteDoc = async (id: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`/api/docs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) {
        setDocs(prev => prev.filter(d => d.id !== id));
        setDeleteConfirm(null);
      } else {
        setError(json.error || 'Delete failed');
      }
    } catch {
      setError('Delete failed');
    }
  };

  // ── Category update handler ──
  const updateCategory = async (id: number, category: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`/api/docs/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });
      const json = await res.json();
      if (json.ok) {
        setDocs(prev => prev.map(d => d.id === id ? { ...d, category } : d));
        setEditingDoc(null);
      }
    } catch {
      setError('Update failed');
    }
  };

  // ── Drag & drop handlers ──
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  const visibleCategories = CATEGORIES.filter(c => c.value !== 'all');

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-calm-900">Document Studio</h1>
          <p className="mt-1 text-calm-600">Upload scattered documents — AI categorizes and organizes them.</p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-2">✕</button>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`card border-dashed border-2 mb-6 text-center py-10 cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-brand-400 bg-brand-50/50'
            : uploading
            ? 'border-brand-300 bg-brand-50/30'
            : 'border-calm-300 bg-calm-50/50 hover:border-brand-300 hover:bg-brand-50/20'
        }`}
      >
        {uploading ? (
          <div>
            <div className="text-3xl mb-3 animate-bounce">⏳</div>
            <h3 className="font-semibold text-calm-700 mb-1">Processing...</h3>
            <p className="text-sm text-calm-500">{uploadProgress || 'AI is analyzing your documents...'}</p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3 text-calm-400">◫</div>
            <h3 className="font-semibold text-calm-700 mb-1">
              {dragOver ? '✨ Drop files here' : 'Drop files here or click to browse'}
            </h3>
            <p className="text-sm text-calm-500">Supports {ACCEPTED_LABELS}</p>
            <p className="text-xs text-calm-400 mt-1">Max 25MB per file — AI will automatically categorize and summarize</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white text-calm-600 border border-calm-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-full sm:w-56"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-calm-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-calm-400 hover:text-calm-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex bg-calm-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                viewMode === 'grid' ? 'bg-white text-calm-900 shadow-sm' : 'text-calm-500'
              }`}
            >
              ▦ Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                viewMode === 'timeline' ? 'bg-white text-calm-900 shadow-sm' : 'text-calm-500'
              }`}
            >
              ◷ Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Document list */}
      {loading ? (
        <div className="text-center py-16 text-calm-500">
          <div className="text-3xl mb-3 animate-pulse">◫</div>
          <p>Loading documents...</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 text-calm-300">◫</div>
          <h3 className="text-lg font-semibold text-calm-700 mb-2">No documents yet</h3>
          <p className="text-calm-500 max-w-md mx-auto">
            Upload your first document — bills, letters, pay stubs, screenshots, emails, or any paperwork you need organized. LIFECTRL's AI will categorize and summarize it for you.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map(doc => {
            const catInfo = CATEGORY_MAP[doc.category] || CATEGORY_MAP.other;
            return (
              <div key={doc.id} className="card flex flex-col group relative">
                {/* Delete confirm overlay */}
                {deleteConfirm === doc.id && (
                  <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-10 p-4">
                    <p className="text-calm-800 font-medium mb-1">Delete "{doc.original_name}"?</p>
                    <p className="text-sm text-calm-500 mb-3">This cannot be undone.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn-ghost text-sm px-4"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteDoc(doc.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Card content */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-calm-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {getFileIcon(doc.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-calm-900 truncate" title={doc.original_name}>
                      {doc.original_name}
                    </h3>
                    <p className="text-xs text-calm-400 mt-0.5">
                      {getFileSizeDisplay(doc.file_size)} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                {doc.summary && (
                  <p className="text-sm text-calm-600 mt-3 line-clamp-2">{doc.summary}</p>
                )}

                {/* Tags & Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-calm-100">
                  {/* Category badge / dropdown */}
                  {editingDoc === doc.id ? (
                    <select
                      value={doc.category}
                      onChange={(e) => updateCategory(doc.id, e.target.value)}
                      onBlur={() => setEditingDoc(null)}
                      autoFocus
                      className="text-xs px-2 py-1 rounded-full border border-brand-300 bg-white text-calm-800 focus:outline-none focus:ring-1 focus:ring-brand-400"
                    >
                      {visibleCategories.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingDoc(doc.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition hover:opacity-80 ${catInfo.color}`}
                      title="Click to change category"
                    >
                      {catInfo.label}
                    </button>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.ai_processed ? (
                      <span className="text-xs text-brand-500" title="AI analyzed">🤖</span>
                    ) : null}
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(doc.id); }}
                      className="text-calm-400 hover:text-red-500 p-1 text-sm transition"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Timeline view */
        <div className="relative pl-8 border-l-2 border-calm-200 space-y-6 ml-4">
          {docs.map(doc => {
            const catInfo = CATEGORY_MAP[doc.category] || CATEGORY_MAP.other;
            return (
              <div key={doc.id} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[2.15rem] top-1 w-3 h-3 rounded-full bg-brand-400 border-2 border-white shadow-sm" />

                {/* Delete confirm */}
                {deleteConfirm === doc.id && (
                  <div className="card mb-2 bg-red-50 border-red-200">
                    <p className="text-sm font-medium mb-2">Delete "{doc.original_name}"?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirm(null)} className="btn-ghost text-sm">Cancel</button>
                      <button onClick={() => deleteDoc(doc.id)} className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg">Delete</button>
                    </div>
                  </div>
                )}

                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{getFileIcon(doc.file_type)}</span>
                    <div className="min-w-0">
                      <h3 className="font-medium text-calm-900 truncate">{doc.original_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                        <span className="text-xs text-calm-400">
                          {getFileSizeDisplay(doc.file_size)} · {formatDate(doc.created_at)}
                        </span>
                      </div>
                      {doc.summary && (
                        <p className="text-sm text-calm-500 mt-1 line-clamp-1">{doc.summary}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(doc.id)}
                    className="opacity-0 group-hover:opacity-100 text-calm-400 hover:text-red-500 p-1 transition"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      {docs.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-calm-500 text-sm">
            Upload emails, screenshots, PDFs, and letters — LIFECTRL's AI will organize them into structured, searchable records.
          </p>
        </div>
      )}
    </div>
  );
}
