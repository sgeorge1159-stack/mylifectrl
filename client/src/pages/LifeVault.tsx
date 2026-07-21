import { useState, useEffect, useCallback } from 'react';

// ── Types ──
interface VaultEntry {
  id: number;
  user_id: number;
  document_id: number | null;
  title: string;
  description: string;
  tags: string;
  created_at: string;
  filename: string | null;
  file_type: string | null;
  category: string | null;
  original_name: string | null;
}

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  tags: string;
  created_at: string;
  type: 'vault_item' | 'document';
  filename: string | null;
  file_type: string | null;
  category: string | null;
  original_name: string | null;
}

interface DocRecord {
  id: number;
  original_name: string;
  file_type: string;
  category: string;
  filename: string;
}

interface VaultStats {
  total_items: number;
  total_documents: number;
  recent_count: number;
  top_tags: { tag: string; count: number }[];
}

type ViewMode = 'grid' | 'timeline';

// ── Helpers ──
function getFileIcon(fileType: string | null): string {
  if (!fileType) return '◒';
  if (fileType.startsWith('image/')) return '🖼';
  if (fileType === 'application/pdf') return '📄';
  if (fileType === 'text/plain' || fileType === 'message/rfc822') return '📝';
  if (fileType.includes('word')) return '📃';
  return '📎';
}

function getTypeIcon(type: 'vault_item' | 'document'): string {
  return type === 'vault_item' ? '◒' : '◫';
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
  return localStorage.getItem('token');
}

function parseTags(tags: string): string[] {
  return tags.split(',').map(t => t.trim()).filter(Boolean);
}

export default function LifeVault() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [error, setError] = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formDocId, setFormDocId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ── Fetch vault items ──
  const fetchEntries = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setError('');

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (activeTag.trim()) params.set('tag', activeTag.trim());

    try {
      const res = await fetch(`/api/vault?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) {
        setEntries(json.data);
      } else {
        setError(json.error || 'Failed to load vault');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTag]);

  // ── Fetch timeline ──
  const fetchTimeline = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/vault/timeline', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) setTimeline(json.data);
    } catch { /* ignore */ }
  }, []);

  // ── Fetch stats ──
  const fetchStats = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/vault/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) setStats(json.data);
    } catch { /* ignore */ }
  }, []);

  // ── Fetch docs (for linking) ──
  const fetchDocs = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/docs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) setDocs(json.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchTimeline();
    fetchStats();
    fetchDocs();
  }, [fetchEntries, fetchTimeline, fetchStats, fetchDocs]);

  // ── Open add modal ──
  const openAddModal = () => {
    setFormMode('add');
    setEditingId(null);
    setFormTitle('');
    setFormDesc('');
    setFormTags('');
    setFormDocId(null);
    setShowAddModal(true);
  };

  // ── Open edit modal ──
  const openEditModal = (entry: VaultEntry) => {
    setFormMode('edit');
    setEditingId(entry.id);
    setFormTitle(entry.title);
    setFormDesc(entry.description || '');
    setFormTags(entry.tags || '');
    setFormDocId(entry.document_id);
    setShowAddModal(true);
  };

  // ── Submit form ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setSaving(true);
    setError('');

    const token = getToken();
    if (!token) return;

    const body: any = {
      title: formTitle.trim(),
      description: formDesc.trim(),
      tags: formTags,
      document_id: formDocId || null,
    };

    try {
      if (formMode === 'add') {
        const res = await fetch('/api/vault', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!json.ok) {
          setError(json.error || 'Failed to create');
          return;
        }
      } else {
        const res = await fetch(`/api/vault/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!json.ok) {
          setError(json.error || 'Failed to update');
          return;
        }
      }

      setShowAddModal(false);
      fetchEntries();
      fetchTimeline();
      fetchStats();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id: number) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) {
        setDeleteConfirm(null);
        fetchEntries();
        fetchTimeline();
        fetchStats();
      } else {
        setError(json.error || 'Delete failed');
      }
    } catch {
      setError('Delete failed');
    }
  };

  const totalEvents = (stats?.total_items || 0) + (stats?.total_documents || 0);
  const hasContent = entries.length > 0 || (stats?.total_documents || 0) > 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-calm-900">LifeVault</h1>
          <p className="mt-1 text-calm-600">Your secure, searchable archive of life's important documents and records.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          + Add to Vault
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-2">✕</button>
        </div>
      )}

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-calm-900">{stats.total_items}</div>
            <div className="text-xs text-calm-500 mt-1">Vault Items</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-calm-900">{stats.total_documents}</div>
            <div className="text-xs text-calm-500 mt-1">Documents</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-calm-900">{stats.recent_count}</div>
            <div className="text-xs text-calm-500 mt-1">Added (30 days)</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-2xl font-bold text-brand-500">{stats.top_tags.length}</div>
            <div className="text-xs text-calm-500 mt-1">Tag Categories</div>
          </div>
        </div>
      )}

      {/* Search + View toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            className="input-field pl-10 py-2.5"
            placeholder="Search your vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-calm-400">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-calm-400 hover:text-calm-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
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

      {/* Tag cloud */}
      {stats && stats.top_tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-calm-400 font-medium">Filter:</span>
          <button
            onClick={() => setActiveTag('')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              !activeTag
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-white text-calm-600 border border-calm-200 hover:border-brand-300'
            }`}
          >
            All
          </button>
          {stats.top_tags.map(({ tag }) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                activeTag === tag
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-brand-100 text-brand-700 border border-brand-200 hover:bg-brand-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      {loading ? (
        <div className="text-center py-16 text-calm-500">
          <div className="text-3xl mb-3 animate-pulse">◒</div>
          <p>Loading vault...</p>
        </div>
      ) : !hasContent ? (
        /* Empty state */
        <div className="card text-center py-12">
          <div className="text-5xl mb-4 text-calm-300">◒</div>
          <h3 className="text-lg font-semibold text-calm-700 mb-2">Your LifeVault is empty</h3>
          <p className="text-calm-500 max-w-md mx-auto mb-6">
            Save important documents and records here for easy access when you need them.
          </p>
          <button onClick={openAddModal} className="btn-primary text-sm">
            + Add your first entry
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(entry => (
            <div key={entry.id} className="card flex flex-col group relative">
              {/* Delete confirm overlay */}
              {deleteConfirm === entry.id && (
                <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-10 p-4">
                  <p className="text-calm-800 font-medium mb-1">Delete "{entry.title}"?</p>
                  <p className="text-sm text-calm-500 mb-3">This will not delete the linked document.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)} className="btn-ghost text-sm px-4">Cancel</button>
                    <button onClick={() => handleDelete(entry.id)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition">Delete</button>
                  </div>
                </div>
              )}

              {/* Card content */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-calm-100 flex items-center justify-center text-xl flex-shrink-0">
                  {getFileIcon(entry.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-calm-900 truncate" title={entry.title}>
                    {entry.title}
                  </h3>
                  <p className="text-xs text-calm-400 mt-0.5">
                    {formatDate(entry.created_at)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {entry.description && (
                <p className="text-sm text-calm-600 mt-3 line-clamp-2">{entry.description}</p>
              )}

              {/* Linked doc */}
              {entry.original_name && (
                <div className="mt-2 text-xs text-calm-500 flex items-center gap-1">
                  <span>📎</span>
                  <span className="truncate">{entry.original_name}</span>
                </div>
              )}

              {/* Tags + Actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-calm-100">
                <div className="flex flex-wrap gap-1">
                  {parseTags(entry.tags).slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                      {tag}
                    </span>
                  ))}
                  {parseTags(entry.tags).length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-calm-100 text-calm-500">
                      +{parseTags(entry.tags).length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(entry)}
                    className="text-calm-400 hover:text-brand-500 p-1 text-sm transition"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(entry.id); }}
                    className="text-calm-400 hover:text-red-500 p-1 text-sm transition"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Timeline view */
        <div className="relative pl-8 border-l-2 border-calm-200 space-y-6 ml-4">
          {timeline.map(item => {
            const isVaultItem = item.type === 'vault_item';
            return (
              <div key={`${item.type}-${item.id}`} className="relative group">
                {/* Timeline dot */}
                <div className={`absolute -left-[2.15rem] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  isVaultItem ? 'bg-brand-500' : 'bg-calm-400'
                }`} />

                {/* Delete confirm for vault items */}
                {isVaultItem && deleteConfirm === item.id && (
                  <div className="card mb-2 bg-red-50 border-red-200">
                    <p className="text-sm font-medium mb-2">Delete "{item.title}"?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirm(null)} className="btn-ghost text-sm">Cancel</button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg">Delete</button>
                    </div>
                  </div>
                )}

                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">
                      {isVaultItem ? getFileIcon(item.file_type) : getTypeIcon(item.type)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-calm-900 truncate">{item.title}</h3>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          isVaultItem ? 'bg-brand-100 text-brand-700' : 'bg-calm-100 text-calm-600'
                        }`}>
                          {isVaultItem ? 'Vault' : 'Doc'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-calm-400">{formatDate(item.created_at)}</span>
                        {item.category && (
                          <>
                            <span className="text-calm-300">·</span>
                            <span className="text-xs text-calm-500 capitalize">{item.category}</span>
                          </>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-calm-500 mt-1 line-clamp-1">{item.description}</p>
                      )}
                      {item.tags && isVaultItem && parseTags(item.tags).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {parseTags(item.tags).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {isVaultItem && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          const entry = entries.find(e => e.id === item.id);
                          if (entry) openEditModal(entry);
                        }}
                        className="text-calm-400 hover:text-brand-500 p-1 text-sm transition"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="text-calm-400 hover:text-red-500 p-1 text-sm transition"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-calm-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-display text-calm-900">
                  {formMode === 'add' ? 'Add to Vault' : 'Edit Entry'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-calm-400 hover:text-calm-600 text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-calm-700 mb-1.5">Title *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., 2026 Tax Return, Lease Agreement"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-calm-700 mb-1.5">Description</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Optional notes about this item..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-calm-700 mb-1.5">
                    Tags <span className="text-calm-400 font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., tax, 2026, important"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                  />
                  {formTags && parseTags(formTags).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {parseTags(formTags).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Link Document */}
                <div>
                  <label className="block text-sm font-medium text-calm-700 mb-1.5">Link a Document</label>
                  <select
                    className="input-field"
                    value={formDocId || ''}
                    onChange={(e) => setFormDocId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">None</option>
                    {docs.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {getFileIcon(doc.file_type)} {doc.original_name}
                      </option>
                    ))}
                  </select>
                  {docs.length === 0 && (
                    <p className="text-xs text-calm-400 mt-1">No documents uploaded yet. Visit Document Studio to upload.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formTitle.trim()}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : formMode === 'add' ? 'Add to Vault' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
