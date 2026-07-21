import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface PlanSummary {
  id: number;
  title: string;
  description: string;
  situation: string;
  status: string;
  taskCount: number;
  completedCount: number;
  created_at: string;
}

export default function Plans() {
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setPlans(data.data);
      }
    } catch {
      // Silently fail — user can still create plans
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ situation: situation.trim() }),
      });
      const data = await res.json();

      if (data.ok) {
        setSituation('');
        await fetchPlans();
      } else {
        setError(data.error || 'Failed to generate plan. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusColors: Record<string, string> = {
    active: 'bg-brand-50 text-brand-700',
    completed: 'bg-green-50 text-green-700',
    archived: 'bg-calm-50 text-calm-600',
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-calm-900">Action Plans</h1>
          <p className="mt-2 text-calm-600">Your AI-powered, personalized roadmaps for life's challenges.</p>
        </div>
      </div>

      {/* Generate Plan Input */}
      <div className="card mb-8 border-brand-200 bg-gradient-to-br from-brand-50/30 to-white">
        <h2 className="font-semibold text-calm-900 mb-3 text-lg">Describe your situation</h2>
        <p className="text-sm text-calm-600 mb-4">
          Tell LIFECTRL what you're facing in your own words. Our AI will build you a personalized, step-by-step action plan.
        </p>
        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="input-field min-h-[120px] resize-y text-base"
            placeholder="Tell me what you're dealing with — job loss, moving, financial changes, paperwork, anything..."
            required
            disabled={loading}
          />
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
          )}
          <button type="submit" disabled={loading || !situation.trim()} className="btn-primary">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing your situation and building your plan...
              </span>
            ) : (
              'Generate Plan'
            )}
          </button>
        </form>
      </div>

      {/* Plans List */}
      {plansLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
          <p className="text-calm-500">Loading your plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 card">
          <div className="text-5xl mb-4">▦</div>
          <h3 className="text-xl font-semibold text-calm-900 mb-2">No action plans yet</h3>
          <p className="text-calm-500 max-w-md mx-auto">
            Describe your situation above and we'll generate a personalized action plan with prioritized tasks, resources, and deadlines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Link key={plan.id} to={`/plans/${plan.id}`} className="card block group cursor-pointer">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-calm-900 group-hover:text-brand-600 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-calm-500 mt-1 line-clamp-2">{plan.description}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[plan.status] || statusColors.active}`}>
                      ● {plan.status}
                    </span>
                    <span className="text-xs text-calm-400">
                      {plan.taskCount} tasks · {plan.completedCount} done
                    </span>
                    {plan.taskCount > 0 && (
                      <span className="text-xs text-calm-400">
                        {Math.round((plan.completedCount / plan.taskCount) * 100)}% complete
                      </span>
                    )}
                    <span className="text-xs text-calm-400">{formatDate(plan.created_at)}</span>
                  </div>
                </div>
                <span className="text-calm-300 group-hover:text-brand-500 transition-colors text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-calm-500 text-sm">
          Plans are AI-generated based on your situation. Describe what you're facing and we'll build you a step-by-step roadmap.
        </p>
      </div>
    </div>
  );
}
