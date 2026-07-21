import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface PlanSummary {
  id: number;
  title: string;
  description: string;
  status: string;
  taskCount: number;
  completedCount: number;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    if (token) {
      fetch('/api/plans', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) setPlans(data.data.slice(0, 3));
        })
        .catch(() => {})
        .finally(() => setPlansLoading(false));
    } else {
      setPlansLoading(false);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-display text-calm-900">
          Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-2 text-calm-600 text-lg">Here's your command center.</p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { to: '/plans', icon: '▦', title: 'Action Plans', desc: 'View and create your personalized action plans', color: 'bg-brand-50 text-brand-600', primary: true },
          { to: '/docs', icon: '◫', title: 'Document Studio', desc: 'Upload and organize your documents with AI', color: 'bg-calm-50 text-calm-600' },
          { to: '/vault', icon: '◒', title: 'LifeVault', desc: 'Your secure, searchable document archive', color: 'bg-warm-50 text-warm-600' },
          { to: '/kits', icon: '✦', title: 'Life Kits', desc: 'Expert guides for life transitions', color: 'bg-brand-50 text-brand-600' },
          { to: '/concierge', icon: '◆', title: 'Concierge', desc: 'Book human help for complex tasks', color: 'bg-calm-50 text-calm-600' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className={`card group cursor-pointer ${item.primary ? 'border-brand-200 bg-gradient-to-br from-brand-50/30 to-white ring-1 ring-brand-100' : ''}`}>
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="font-semibold text-calm-900 mb-1">{item.title}</h3>
            <p className="text-sm text-calm-500">{item.desc}</p>
            {item.primary && (
              <span className="inline-block mt-3 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                Create a plan →
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Recent plans */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-calm-900 text-lg">Recent Plans</h2>
          <Link to="/plans" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </Link>
        </div>

        {plansLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-6 w-6 border-3 border-brand-200 border-t-brand-500 rounded-full mx-auto" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-calm-500 mb-4">No action plans yet. Describe a life situation and we'll build you a personalized roadmap.</p>
            <Link to="/plans" className="btn-primary text-sm">
              Create your first plan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Link key={plan.id} to={`/plans/${plan.id}`} className="flex items-start gap-3 py-3 border-b border-calm-100 last:border-0 group hover:bg-calm-50/50 -mx-2 px-2 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500 text-sm flex-shrink-0">
                  ▦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-calm-800 group-hover:text-brand-600 transition-colors">
                    {plan.title}
                  </div>
                  <div className="text-sm text-calm-500 flex items-center gap-2 flex-wrap">
                    <span>{plan.taskCount} tasks</span>
                    {plan.taskCount > 0 && (
                      <>
                        <span>·</span>
                        <span>{Math.round((plan.completedCount / plan.taskCount) * 100)}% done</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{formatDate(plan.created_at)}</span>
                  </div>
                </div>
                <span className="text-calm-300 group-hover:text-brand-500 text-lg">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
