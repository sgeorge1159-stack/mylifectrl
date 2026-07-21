import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  plan_id: number;
  title: string;
  description: string;
  priority: number;
  status: string;
  category: string;
  resources: string | string[];
  estimated_time: string;
  due_date: string | null;
  created_at: string;
}

interface Plan {
  id: number;
  title: string;
  description: string;
  situation: string;
  status: string;
  disclaimer: string;
  tasks: Task[];
  created_at: string;
}

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  5: { label: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200' },
  4: { label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  3: { label: 'Medium', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  2: { label: 'Low', color: 'bg-green-50 text-green-700 border-green-200' },
  1: { label: 'Nice-to-have', color: 'bg-calm-50 text-calm-500 border-calm-200' },
};

const PRIORITY_DOT: Record<number, string> = {
  5: 'text-red-500',
  4: 'text-orange-500',
  3: 'text-yellow-500',
  2: 'text-green-500',
  1: 'text-calm-400',
};

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  documentation: { label: 'Documentation', icon: '📄' },
  financial: { label: 'Financial', icon: '💰' },
  healthcare: { label: 'Healthcare', icon: '🏥' },
  housing: { label: 'Housing', icon: '🏠' },
  employment: { label: 'Employment', icon: '💼' },
  legal: { label: 'Legal', icon: '⚖️' },
  other: { label: 'Other', icon: '📋' },
};

export default function PlanDetail() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingTask, setTogglingTask] = useState<number | null>(null);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setPlan(data.data);
      } else {
        setError(data.error || 'Plan not found');
      }
    } catch {
      setError('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const toggleTask = async (taskId: number, currentStatus: string) => {
    setTogglingTask(taskId);
    const newCompleted = currentStatus !== 'completed';
    try {
      const res = await fetch(`/api/plans/${id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: newCompleted }),
      });
      const data = await res.json();
      if (data.ok && plan) {
        setPlan({
          ...plan,
          tasks: plan.tasks.map((t) => (t.id === taskId ? { ...t, status: data.data.status } : t)),
        });
      }
    } catch {
      // silently fail
    } finally {
      setTogglingTask(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
          <p className="text-calm-500">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="page-container">
        <Link to="/plans" className="text-calm-500 hover:text-brand-600 text-sm mb-4 inline-block">← Back to plans</Link>
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-calm-900 mb-2">{error || 'Plan not found'}</h2>
          <Link to="/plans" className="text-brand-600 hover:text-brand-700 font-medium">Return to your plans</Link>
        </div>
      </div>
    );
  }

  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const progress = plan.tasks.length > 0 ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  // Group tasks by category
  const tasksByCategory: Record<string, Task[]> = {};
  for (const task of plan.tasks) {
    const cat = task.category || 'other';
    if (!tasksByCategory[cat]) tasksByCategory[cat] = [];
    tasksByCategory[cat].push(task);
  }

  // Sort categories: put high-priority categories first
  const sortedCategories = Object.entries(tasksByCategory).sort((a, b) => {
    const aMax = Math.max(...a[1].map((t) => t.priority));
    const bMax = Math.max(...b[1].map((t) => t.priority));
    return bMax - aMax;
  });

  const statusColors: Record<string, string> = {
    completed: 'bg-green-50 text-green-700 border-green-200',
    in_progress: 'bg-brand-50 text-brand-700 border-brand-200',
    pending: 'bg-calm-50 text-calm-600 border-calm-200',
  };

  return (
    <div className="page-container">
      <Link to="/plans" className="text-calm-500 hover:text-brand-600 text-sm mb-4 inline-block">← Back to plans</Link>

      {/* Plan Header */}
      <div className="card mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-display text-calm-900">{plan.title}</h1>
            <p className="mt-2 text-calm-600">{plan.description}</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full font-medium border ${statusColors[plan.status] || statusColors.active}`}>
            ● {plan.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-calm-700">Progress</span>
            <span className="text-sm text-calm-500">{completedCount}/{plan.tasks.length} tasks · {progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-calm-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Situation */}
        <div className="mt-6 p-4 bg-warm-50 rounded-xl">
          <h3 className="text-sm font-medium text-calm-500 mb-1">Your Situation</h3>
          <p className="text-calm-800">{plan.situation}</p>
        </div>
      </div>

      {/* Disclaimer */}
      {plan.disclaimer && (
        <div className="mb-6 p-4 bg-calm-50 border border-calm-200 rounded-xl text-sm text-calm-600 italic">
          {plan.disclaimer}
        </div>
      )}

      {/* Tasks grouped by category */}
      <h2 className="text-xl font-bold font-display text-calm-900 mb-4">Tasks & Timeline</h2>

      <div className="space-y-6">
        {sortedCategories.map(([category, tasks]) => {
          const catInfo = CATEGORY_LABELS[category] || CATEGORY_LABELS.other;
          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-calm-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>{catInfo.icon}</span> {catInfo.label}
                <span className="text-calm-400 font-normal normal-case">({tasks.length} tasks)</span>
              </h3>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  const isToggling = togglingTask === task.id;
                  const priorityInfo = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS[3];

                  // Parse resources
                  let resources: string[] = [];
                  if (task.resources) {
                    if (Array.isArray(task.resources)) {
                      resources = task.resources;
                    } else if (typeof task.resources === 'string') {
                      try {
                        resources = JSON.parse(task.resources);
                      } catch {
                        resources = task.resources ? [task.resources] : [];
                      }
                    }
                  }

                  return (
                    <div key={task.id} className={`card flex items-start gap-4 transition-opacity ${isCompleted ? 'opacity-70' : ''}`}>
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id, task.status)}
                        disabled={isToggling}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-calm-300 hover:border-brand-400'
                        }`}
                      >
                        {isCompleted && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-semibold ${isCompleted ? 'line-through text-calm-400' : 'text-calm-900'}`}>
                            {task.title}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${priorityInfo.color}`}>
                            <span className={PRIORITY_DOT[task.priority]}>●</span>
                            {priorityInfo.label}
                          </span>
                          {task.estimated_time && (
                            <span className="text-xs text-calm-400">⏱ {task.estimated_time}</span>
                          )}
                        </div>
                        <p className="text-sm text-calm-500 mt-1">{task.description}</p>

                        {/* Resources */}
                        {resources.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {resources.map((r, i) => {
                              const isUrl = r.startsWith('http://') || r.startsWith('https://');
                              return isUrl ? (
                                <a
                                  key={i}
                                  href={r}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors"
                                >
                                  🔗 {r.replace(/^https?:\/\//, '').split('/')[0]}
                                </a>
                              ) : (
                                <span key={i} className="text-xs px-2 py-1 bg-calm-50 text-calm-600 rounded-lg">
                                  {r}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Due date */}
                        {task.due_date && (
                          <p className="text-xs text-calm-400 mt-2">
                            📅 Due: {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
