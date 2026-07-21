import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getKitPaymentLink, openPaymentLink } from '../config/payments';

interface KitContent {
  overview: string;
  steps: { order: number; title: string; description: string; resources: string[] }[];
  checklist: string[];
  templates: { name: string; description: string }[];
  tips: string[];
}

interface Kit {
  id: number;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  content: KitContent | null;
  purchased: boolean;
  purchased_at: string | null;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  employment: 'bg-blue-50 text-blue-700',
  housing: 'bg-amber-50 text-amber-700',
  financial: 'bg-green-50 text-green-700',
  career: 'bg-purple-50 text-purple-700',
  organization: 'bg-calm-50 text-calm-700',
};

const categoryEmoji: Record<string, string> = {
  employment: '💼',
  housing: '🏠',
  financial: '💰',
  career: '🚀',
  organization: '📋',
};

export default function KitDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem('token');

  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Local checklist state
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  // Local expanded step state
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const fetchKit = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/kits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setKit(data.data);
      } else {
        setError(data.error || 'Kit not found');
      }
    } catch {
      setError('Failed to load kit. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchKit();
  }, [fetchKit]);

  // Handle post-purchase query param
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      setSearchParams(newParams, { replace: true });
      const timer = setTimeout(() => setPaymentSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handlePurchase = () => {
    if (!kit) return;
    const link = getKitPaymentLink(kit.title);
    if (link) {
      // Open Stripe checkout in a new tab
      openPaymentLink(link);
    } else {
      setPurchaseError('Payment link not available for this kit. Please contact support.');
    }
  };

  const handleConfirmPurchase = async () => {
    if (!token || !id) return;
    setPurchasing(true);
    setPurchaseError('');
    try {
      const res = await fetch(`/api/kits/${id}/purchase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.ok) {
        await fetchKit();
        setPaymentSuccess(false);
      } else {
        setPurchaseError(data.error || 'Could not confirm purchase. Please try again.');
      }
    } catch {
      setPurchaseError('Network error. Please check your connection and try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
          <p className="text-calm-500">Loading kit...</p>
        </div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="page-container">
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">✦</div>
          <h3 className="text-xl font-semibold text-calm-900 mb-2">Kit Not Found</h3>
          <p className="text-calm-500 mb-4">{error || 'This kit could not be loaded.'}</p>
          <Link to="/kits" className="btn-primary text-sm">
            ← Back to Life Kits
          </Link>
        </div>
      </div>
    );
  }

  const content = kit.content;
  const isPurchased = kit.purchased;
  const completedCount = checkedItems.size;
  const totalChecklist = content?.checklist?.length || 0;

  return (
    <div className="page-container">
      {/* Back link */}
      <Link
        to="/kits"
        className="inline-flex items-center gap-1 text-sm text-calm-500 hover:text-brand-600 mb-6 transition-colors"
      >
        ← Back to Life Kits
      </Link>

      {/* Header Card */}
      <div className="card mb-8 border-brand-200 bg-gradient-to-br from-brand-50/20 to-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{categoryEmoji[kit.category] || '✦'}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  categoryColors[kit.category] || 'bg-calm-50 text-calm-700'
                }`}
              >
                {kit.category}
              </span>
              {isPurchased && (
                <span className="text-xs px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
                  ✓ Purchased
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-calm-900 mb-3">
              {kit.title}
            </h1>
            <p className="text-calm-600">{kit.description}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-2xl font-bold text-calm-900">{formatPrice(kit.price_cents)}</span>
            {isPurchased ? (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <span>✓</span> Purchased{' '}
                {kit.purchased_at &&
                  `on ${new Date(kit.purchased_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}`}
              </span>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {purchaseError && (
                  <p className="text-sm text-red-600">{purchaseError}</p>
                )}
                <button
                  onClick={handlePurchase}
                  className="btn-primary text-sm px-6 py-3 w-full sm:w-auto"
                >
                  Purchase Kit — {formatPrice(kit.price_cents)}
                </button>
                <p className="text-xs text-calm-400 max-w-[200px] text-right">
                  You'll be redirected to Stripe for secure payment.
                </p>
                {paymentSuccess && (
                  <button
                    onClick={handleConfirmPurchase}
                    disabled={purchasing}
                    className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    {purchasing ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Confirming...
                      </span>
                    ) : (
                      '✓ I\'ve completed payment — unlock my kit'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content sections — only fully visible if purchased */}
      {content && (
        <div className="space-y-8">
          {/* Overview */}
          <section className="card">
            <h2 className="text-xl font-bold font-display text-calm-900 mb-4">📖 Overview</h2>
            <p className="text-calm-700 leading-relaxed whitespace-pre-line">{content.overview}</p>
          </section>

          {/* Steps */}
          <section className="card">
            <h2 className="text-xl font-bold font-display text-calm-900 mb-4">
              🗺️ Step-by-Step Guide
            </h2>
            <div className="space-y-4">
              {content.steps.map((step, i) => {
                const isExpanded = expandedSteps.has(i) || isPurchased;
                const blur = !isPurchased && i >= 2;
                return (
                  <div
                    key={i}
                    className={`border rounded-xl transition-all ${
                      isExpanded
                        ? 'border-calm-200 bg-white'
                        : 'border-calm-100 bg-calm-50/50'
                    }`}
                  >
                    <button
                      onClick={() => toggleStep(i)}
                      disabled={!blur}
                      className={`w-full text-left p-4 flex items-start gap-4 ${
                        blur && !isExpanded ? 'cursor-pointer' : blur ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {step.order}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${isExpanded ? 'text-calm-900' : 'text-calm-500'}`}>
                          {isExpanded ? step.title : 'Preview locked — purchase to unlock all steps'}
                        </h3>
                      </div>
                      {blur && (
                        <span className="text-calm-300 text-sm mt-0.5">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pl-16">
                        <p className="text-calm-700 leading-relaxed whitespace-pre-line">
                          {step.description}
                        </p>
                        {step.resources.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium text-calm-500 uppercase tracking-wide">
                              Resources
                            </p>
                            {step.resources.map((url, ri) => (
                              <a
                                key={ri}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-brand-600 hover:text-brand-700 underline break-all"
                              >
                                {url}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!isPurchased && (
              <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-200 text-center">
                <p className="text-brand-700 font-medium mb-2">
                  Purchase this kit to unlock all {content.steps.length} steps
                </p>
                <button
                  onClick={handlePurchase}
                  className="btn-primary text-sm"
                >
                  Unlock for {formatPrice(kit.price_cents)}
                </button>
              </div>
            )}
          </section>

          {/* Checklist */}
          <section className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display text-calm-900">☑️ Checklist</h2>
              {isPurchased && totalChecklist > 0 && (
                <span className="text-sm text-calm-500">
                  {completedCount} of {totalChecklist} completed
                </span>
              )}
            </div>
            {isPurchased && totalChecklist > 0 && (
              <div className="mb-4 bg-calm-50 rounded-lg h-1.5 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-lg transition-all duration-500"
                  style={{ width: `${(completedCount / totalChecklist) * 100}%` }}
                />
              </div>
            )}
            <div className="space-y-2">
              {content.checklist.map((item, i) => {
                const isChecked = checkedItems.has(i);
                const isLocked = !isPurchased && i >= 5;
                const isVisible = isPurchased || i < 5;
                if (!isVisible) return null;
                return (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                      isPurchased
                        ? 'cursor-pointer hover:bg-calm-50'
                        : 'cursor-not-allowed opacity-60'
                    } ${isChecked ? 'bg-green-50/50' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => isPurchased && toggleCheck(i)}
                      disabled={!isPurchased}
                      className="mt-0.5 w-5 h-5 rounded border-calm-300 text-brand-500 focus:ring-brand-400 cursor-pointer"
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        isChecked ? 'text-calm-500 line-through' : 'text-calm-800'
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
            {!isPurchased && content.checklist.length > 5 && (
              <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-200 text-center">
                <p className="text-brand-700 text-sm font-medium">
                  Purchase to unlock the full {content.checklist.length}-item checklist with progress tracking
                </p>
              </div>
            )}
          </section>

          {/* Templates */}
          <section className="card">
            <h2 className="text-xl font-bold font-display text-calm-900 mb-4">📄 Templates</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.templates.map((tpl, i) => {
                const isLocked = !isPurchased && i >= 2;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      isLocked
                        ? 'border-calm-100 bg-calm-50/50 opacity-60'
                        : 'border-calm-200 bg-white'
                    }`}
                  >
                    <h3 className="font-semibold text-calm-900 mb-1">
                      {isLocked ? '🔒 Template (purchase to unlock)' : tpl.name}
                    </h3>
                    {!isLocked && (
                      <p className="text-sm text-calm-500">{tpl.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
            {!isPurchased && content.templates.length > 2 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handlePurchase}
                  className="btn-primary text-sm"
                >
                  Purchase to access all {content.templates.length} templates
                </button>
              </div>
            )}
          </section>

          {/* Tips */}
          <section className="card">
            <h2 className="text-xl font-bold font-display text-calm-900 mb-4">💡 Pro Tips</h2>
            <div className="space-y-3">
              {content.tips.map((tip, i) => {
                const isLocked = !isPurchased && i >= 3;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl ${
                      isLocked ? 'bg-calm-50/50 opacity-60' : 'bg-warm-50'
                    }`}
                  >
                    <span className="text-warm-500 font-bold text-lg flex-shrink-0 mt-0.5">
                      {isLocked ? '🔒' : '✦'}
                    </span>
                    <p className={`text-sm leading-relaxed ${isLocked ? 'text-calm-400' : 'text-calm-800'}`}>
                      {isLocked ? 'Purchase to unlock all tips' : tip}
                    </p>
                  </div>
                );
              })}
            </div>
            {!isPurchased && content.tips.length > 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handlePurchase}
                  className="btn-primary text-sm"
                >
                  Purchase to unlock all {content.tips.length} tips
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Bottom CTA if not purchased */}
      {!isPurchased && (
        <div className="mt-8 card border-brand-300 bg-gradient-to-r from-brand-50 to-warm-50 text-center">
          <h2 className="text-xl font-bold font-display text-calm-900 mb-2">
            Ready to take control?
          </h2>
          <p className="text-calm-600 mb-4 max-w-md mx-auto">
            Purchase this kit to unlock all steps, the full checklist with progress tracking, templates, and
            pro tips — yours forever.
          </p>
          <button
            onClick={handlePurchase}
            className="btn-primary px-8 py-4 text-lg"
          >
            Purchase Kit — {formatPrice(kit.price_cents)}
          </button>
          {paymentSuccess && (
            <div className="mt-4">
              <button
                onClick={handleConfirmPurchase}
                disabled={purchasing}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-sm"
              >
                {purchasing ? 'Confirming...' : "✓ I've completed payment — unlock my kit"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
