import { useState, useEffect, useRef } from 'react';

interface StreamTask { title: string; description: string; priority: number; category: string; resources: string[]; estimated_time: string; }
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
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamTasks, setStreamTasks] = useState<StreamTask[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

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
    return () => controllerRef.current?.abort();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setError('');
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    try {
      const res = await fetch('/api/plans/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          situation: focusAreas.length
            ? `${situation.trim()}\n\nAreas I may need help with: ${focusAreas.join(', ')}.`
            : situation.trim(),
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error('Unable to start plan generation.');
      controllerRef.current = controller;
      setStreamTitle(''); setStreamDescription(''); setStreamTasks([]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let pending = '';
      let planId: number | null = null;
      const process = (raw: string) => {
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const event = JSON.parse(line.slice(6));
          if (event.type === 'title') setStreamTitle(event.title);
          else if (event.type === 'description') setStreamDescription(event.description);
          else if (event.type === 'task') setStreamTasks((tasks) => [...tasks, event.task]);
          else if (event.type === 'error') throw new Error(event.message);
          else if (event.type === 'complete') planId = event.planId;
        }
      };
      while (true) {
        const { value, done } = await reader.read();
        pending += decoder.decode(value || new Uint8Array(), { stream: !done });
        const events = pending.split('\n\n'); pending = events.pop() || '';
        process(events.join('\n\n'));
        if (done) break;
      }
      if (!planId) throw new Error('Plan generation ended before it was saved.');
      setSituation(''); setFocusAreas([]); await fetchPlans();
      window.location.href = `/plans/${planId}`;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError('Your plan is taking longer than expected. The AI may be busy — try describing your situation more briefly, or wait a moment and try again.');
      } else {
        setError('Unable to reach our servers. Please check your internet connection and try again.');
      }
    } finally {
      clearTimeout(timeoutId);
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
        {loading ? (
          <div className="space-y-5" aria-live="polite">
            <h2 className="text-2xl font-bold text-calm-900">{streamTitle || 'Building your action plan…'}</h2>
            {streamDescription && <p className="text-calm-600">{streamDescription}</p>}
            <div className="space-y-3">{streamTasks.map((task, i) => <div key={`${task.title}-${i}`} className="task-card-streaming rounded-xl border border-calm-100 bg-white p-4"><div className="font-semibold text-calm-900">{task.title}</div><p className="mt-1 text-sm text-calm-600">{task.description}</p><span className="mt-2 inline-block text-xs text-calm-400">{task.estimated_time}</span></div>)}</div>
            <p className="text-sm text-brand-600 animate-pulse">✦ AI is working…</p>
          </div>
        ) : <>
        <h2 className="font-semibold text-calm-900 mb-3 text-lg">Describe your situation</h2>
        <p className="text-sm text-calm-600 mb-4">
          Tell MyCTRL what you're facing in your own words. Our AI will build you a personalized, step-by-step action plan.
        </p>
        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="input-field min-h-[160px] resize-y text-base"
            placeholder="Tell us what's going on. What do you need help with?"
            required
            disabled={loading}
            aria-label="Describe what's going on"
          />
          <fieldset disabled={loading}>
            <legend className="text-sm font-medium text-calm-700 mb-2">Are you dealing with...</legend>
            <div className="flex flex-wrap gap-2">
              {['Housing', 'Job loss', 'Benefits', 'Legal', 'Medical', 'Other'].map((area) => {
                const selected = focusAreas.includes(area);
                return (
                  <label key={area} className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors ${selected ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-calm-200 bg-white text-calm-600 hover:border-brand-300'}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected}
                      onChange={() => setFocusAreas((current) => selected ? current.filter((item) => item !== area) : [...current, area])}
                    />
                    {area}
                  </label>
                );
              })}
            </div>
          </fieldset>
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
        </>}
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
