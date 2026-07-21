import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getKitPaymentLink, openPaymentLink } from '../config/payments';

interface Kit {
  id: number;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  created_at: string;
}

interface PurchasedKit {
  id: number;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  content: any;
  purchased_at: string;
  created_at: string;
}

const categories = [
  { key: 'all', label: 'All', emoji: '✦' },
  { key: 'employment', label: 'Employment', emoji: '💼' },
  { key: 'housing', label: 'Housing', emoji: '🏠' },
  { key: 'financial', label: 'Financial', emoji: '💰' },
  { key: 'career', label: 'Career', emoji: '🚀' },
  { key: 'organization', label: 'Organization', emoji: '📋' },
];

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

export default function LifeKits() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem('token');

  const [kits, setKits] = useState<Kit[]>([]);
  const [purchasedKits, setPurchasedKits] = useState<PurchasedKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasedLoading, setPurchasedLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'mine'>('browse');
  const [activeCategory, setActiveCategory] = useState('all');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handle post-purchase query param
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      // Clear the param from URL without navigation
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      setSearchParams(newParams, { replace: true });
      // Auto-dismiss after 5s
      const timer = setTimeout(() => setPaymentSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
    fetch(`/api/kits${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setKits(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, token]);

  useEffect(() => {
    if (!token) return;

    setPurchasedLoading(true);
    fetch('/api/kits/purchases', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPurchasedKits(data.data);
      })
      .catch(() => {})
      .finally(() => setPurchasedLoading(false));
  }, [token]);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-calm-900">Life Kits</h1>
        <p className="mt-2 text-calm-600 text-lg">
          Expert guides for life's biggest moments. Buy once, own forever.
        </p>
      </div>

      {/* Payment success banner */}
      {paymentSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-pulse">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-800">Payment successful!</p>
            <p className="text-sm text-green-700">
              Thank you for your purchase. Click "I've completed payment" on the kit page to unlock your content, or browse your kits in the "My Kits" tab.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-calm-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'browse'
              ? 'bg-white text-calm-900 shadow-sm'
              : 'text-calm-500 hover:text-calm-700'
          }`}
        >
          ✦ Browse Kits
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'mine'
              ? 'bg-white text-calm-900 shadow-sm'
              : 'text-calm-500 hover:text-calm-700'
          }`}
        >
          ◈ My Kits
          {purchasedKits.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-brand-500 text-white rounded-full">
              {purchasedKits.length}
            </span>
          )}
        </button>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white text-calm-600 border border-calm-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Kit Cards Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
              <p className="text-calm-500">Loading kits...</p>
            </div>
          ) : kits.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-5xl mb-4">✦</div>
              <h3 className="text-xl font-semibold text-calm-900 mb-2">No kits found</h3>
              <p className="text-calm-500">
                {activeCategory !== 'all'
                  ? `No kits available in the ${activeCategory} category yet.`
                  : 'Check back soon for new Life Kits.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kits.map((kit) => (
                <div
                  key={kit.id}
                  className="card flex flex-col group cursor-pointer hover:border-brand-300 hover:shadow-lg transition-all"
                  onClick={() => navigate(`/kits/${kit.id}`)}
                >
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{categoryEmoji[kit.category] || '✦'}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        categoryColors[kit.category] || 'bg-calm-50 text-calm-700'
                      }`}
                    >
                      {kit.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-calm-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {kit.title}
                  </h3>
                  <p className="text-sm text-calm-600 mb-4 flex-1 line-clamp-2">{kit.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-calm-100">
                    <span className="text-xl font-bold text-calm-900">{formatPrice(kit.price_cents)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = getKitPaymentLink(kit.title);
                          if (link) openPaymentLink(link);
                        }}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Purchase →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* My Kits Tab */}
      {activeTab === 'mine' && (
        <>
          {purchasedLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
              <p className="text-calm-500">Loading your kits...</p>
            </div>
          ) : purchasedKits.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-5xl mb-4">◈</div>
              <h3 className="text-xl font-semibold text-calm-900 mb-2">No purchased kits yet</h3>
              <p className="text-calm-500 max-w-md mx-auto mb-4">
                Browse our expert-curated Life Kits to find guides for life's biggest moments. They're yours forever after purchase.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="btn-primary text-sm"
              >
                Browse Life Kits
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedKits.map((kit) => (
                <Link
                  key={kit.id}
                  to={`/kits/${kit.id}`}
                  className="card flex flex-col group cursor-pointer hover:border-brand-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{categoryEmoji[kit.category] || '✦'}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        categoryColors[kit.category] || 'bg-calm-50 text-calm-700'
                      }`}
                    >
                      {kit.category}
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
                      ✓ Purchased
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-calm-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {kit.title}
                  </h3>
                  <p className="text-sm text-calm-600 mb-4 flex-1 line-clamp-2">{kit.description}</p>

                  {kit.content?.steps && (
                    <div className="mb-3">
                      <p className="text-xs text-calm-400 mb-1">{kit.content.steps.length} steps</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-calm-100">
                    <span className="text-sm text-calm-500">
                      {new Date(kit.purchased_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-brand-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Access Kit →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer note */}
      <div className="mt-12 text-center">
        <p className="text-sm text-calm-400">
          Life Kits are expert-curated guides designed to help you navigate life's challenges.
          Purchase once, access forever.
        </p>
      </div>
    </div>
  );
}
