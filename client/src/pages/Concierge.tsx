import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { STRIPE_LINKS, openPaymentLink } from '../config/payments';

interface ConciergeBooking {
  id: number;
  user_id: number;
  topic: string;
  description: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

const TIME_SLOTS = [
  { value: 'Morning (9am-12pm)', label: 'Morning (9am–12pm)' },
  { value: 'Afternoon (12pm-4pm)', label: 'Afternoon (12pm–4pm)' },
  { value: 'Evening (4pm-7pm)', label: 'Evening (4pm–7pm)' },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Confirmed', classes: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Completed', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-50 text-gray-500 border-gray-200' },
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Concierge() {
  const token = localStorage.getItem('token');
  const [searchParams, setSearchParams] = useSearchParams();

  // Booking form state
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<ConciergeBooking | null>(null);

  // Two-step payment flow
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  // Bookings list state
  const [bookings, setBookings] = useState<ConciergeBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPreferredTime, setEditPreferredTime] = useState('');
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Cancel confirmation state
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchBookings = () => {
    if (!token) return;
    setBookingsLoading(true);
    fetch('/api/concierge/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setBookings(data.data);
      })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // Handle post-purchase query param
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      setPaymentStarted(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      setSearchParams(newParams, { replace: true });
      const timer = setTimeout(() => setPaymentSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const resetForm = () => {
    setTopic('');
    setDescription('');
    setPreferredTime('');
    setError('');
    setSuccess(null);
    setPaymentStarted(false);
    setPaymentSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    // Client-side validation
    if (!topic.trim()) { setError('Please enter a topic.'); return; }
    if (topic.trim().length > 200) { setError('Topic must be 200 characters or fewer.'); return; }
    if (!description.trim()) { setError('Please describe what you need help with.'); return; }
    if (description.trim().length > 1000) { setError('Description must be 1000 characters or fewer.'); return; }
    if (!preferredTime) { setError('Please select a preferred time.'); return; }

    // Open Stripe payment link in new tab
    openPaymentLink(STRIPE_LINKS.concierge);
    setPaymentStarted(true);
  };

  const handleConfirmPayment = async () => {
    setError('');
    setConfirmingPayment(true);
    try {
      const res = await fetch('/api/concierge/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: topic.trim(),
          description: description.trim(),
          preferred_time: preferredTime,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(data.data);
        resetForm();
        fetchBookings();
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const startEdit = (booking: ConciergeBooking) => {
    setEditingId(booking.id);
    setEditTopic(booking.topic);
    setEditDescription(booking.description);
    setEditPreferredTime(booking.preferred_time);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const handleEdit = async (id: number) => {
    setEditError('');
    if (!editTopic.trim()) { setEditError('Topic cannot be empty.'); return; }
    if (editTopic.trim().length > 200) { setEditError('Topic must be 200 characters or fewer.'); return; }
    if (!editDescription.trim()) { setEditError('Description cannot be empty.'); return; }
    if (editDescription.trim().length > 1000) { setEditError('Description must be 1000 characters or fewer.'); return; }
    if (!editPreferredTime) { setEditError('Please select a preferred time.'); return; }

    setEditSaving(true);
    try {
      const res = await fetch(`/api/concierge/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: editTopic.trim(),
          description: editDescription.trim(),
          preferred_time: editPreferredTime,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setEditingId(null);
        fetchBookings();
      } else {
        setEditError(data.error || 'Failed to update booking.');
      }
    } catch {
      setEditError('Network error. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const res = await fetch(`/api/concierge/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.ok) {
        setCancellingId(null);
        fetchBookings();
      }
    } catch {}
  };

  return (
    <div className="page-container">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl">
            ◆
          </div>
          <h1 className="text-3xl font-bold font-display text-calm-900">Human Concierge</h1>
        </div>
        <p className="text-calm-600 text-lg max-w-2xl">
          Need more than AI? Book a session with a real expert for complex paperwork and administrative tasks.
        </p>

        {/* Key Benefits */}
        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { icon: '✦', label: 'Expert guidance' },
            { icon: '◈', label: 'Personalized support' },
            { icon: '◒', label: 'Confidential & secure' },
          ].map((benefit) => (
            <div
              key={benefit.label}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-calm-200 rounded-full text-sm font-medium text-calm-700"
            >
              <span className="text-brand-500">{benefit.icon}</span>
              {benefit.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content: form + bookings side-by-side on desktop ── */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── Booking form ── */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="card relative overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50/20 via-white to-white"
          >
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-warm-400" />

            <div className="relative pt-2">
              <h2 className="text-xl font-bold font-display text-calm-900 mb-1">
                Request a Session
              </h2>
              <p className="text-sm text-calm-500 mb-6">
                Tell us what you need and when you're available. We'll match you with the right expert.
              </p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-5 p-5 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✓</span>
                    <span className="font-semibold text-green-800">Booking submitted!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    We've received your request for <strong>{success.topic}</strong>. We'll review it and
                    reach out to confirm your exact session time via email. Your reference is{' '}
                    <strong>#{success.id}</strong>.
                  </p>
                </div>
              )}

              {paymentSuccess && !success && (
                <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-semibold text-green-800">Payment successful!</p>
                    <p className="text-sm text-green-700">
                      Click "I've completed payment" below to finalize your booking.
                    </p>
                  </div>
                </div>
              )}

              {paymentStarted && !success && !confirmingPayment && (
                <div className="mb-5 p-3 bg-brand-50 border border-brand-200 rounded-xl text-sm text-brand-700">
                  Stripe checkout opened in a new tab. Complete your payment there, then click the green button below to create your booking.
                </div>
              )}

              {/* Topic */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-calm-700 mb-1.5">
                  Topic <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="input-field"
                  placeholder="E.g., Help filing unemployment appeal, Navigating COBRA paperwork…"
                  maxLength={200}
                  disabled={submitting}
                />
                <p className="text-xs text-calm-400 mt-1">{topic.length}/200</p>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-calm-700 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field min-h-[120px] resize-y"
                  placeholder="Describe what you're dealing with and what kind of help you need…"
                  maxLength={1000}
                  disabled={submitting}
                />
                <p className="text-xs text-calm-400 mt-1">{description.length}/1000</p>
              </div>

              {/* Preferred time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-calm-700 mb-1.5">
                  Preferred time <span className="text-red-400">*</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="input-field"
                  disabled={submitting}
                >
                  <option value="">Select a time window…</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-calm-400 mt-1">
                  We'll confirm exact timing via email
                </p>
              </div>

              {/* Price indicator + Submit */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-calm-900">$75</span>
                  <span className="text-sm text-calm-500">per session</span>
                </div>
                {!paymentStarted ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
                    Pay $75 & Book Session →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={confirmingPayment}
                    className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-md"
                  >
                    {confirmingPayment ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                        Creating booking…
                      </>
                    ) : (
                      "✓ I've completed payment — create my booking"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* ── Your Bookings ── */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold font-display text-calm-900 mb-4">Your Bookings</h2>

          {bookingsLoading ? (
            <div className="text-center py-12 card">
              <div className="animate-spin h-6 w-6 border-3 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-3" />
              <p className="text-sm text-calm-500">Loading your bookings…</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 card border-dashed border-calm-300 bg-calm-50/30">
              <div className="text-4xl mb-3">◆</div>
              <h3 className="font-semibold text-calm-900 mb-1">No bookings yet</h3>
              <p className="text-sm text-calm-500 max-w-xs mx-auto">
                Request your first session above — we'll match you with an expert who can help.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isEditing = editingId === booking.id;
                const isCancelling = cancellingId === booking.id;
                const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const canEdit = booking.status === 'pending';
                const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

                if (isEditing) {
                  return (
                    <div key={booking.id} className="card border-brand-300 ring-1 ring-brand-100">
                      <h3 className="font-semibold text-calm-900 mb-3 text-sm">Edit Booking #{booking.id}</h3>

                      {editError && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                          {editError}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-calm-600 mb-1">Topic</label>
                          <input
                            type="text"
                            value={editTopic}
                            onChange={(e) => setEditTopic(e.target.value)}
                            className="input-field text-sm py-2"
                            maxLength={200}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-calm-600 mb-1">Description</label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="input-field text-sm py-2 min-h-[80px] resize-y"
                            maxLength={1000}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-calm-600 mb-1">Preferred time</label>
                          <select
                            value={editPreferredTime}
                            onChange={(e) => setEditPreferredTime(e.target.value)}
                            className="input-field text-sm py-2"
                          >
                            <option value="">Select…</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(booking.id)}
                          disabled={editSaving}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={cancelEdit} className="btn-ghost text-sm" disabled={editSaving}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                if (isCancelling) {
                  return (
                    <div key={booking.id} className="card border-red-200 bg-red-50/30">
                      <p className="text-sm text-calm-800 mb-3">
                        Cancel booking <strong>#{booking.id}</strong> — {truncate(booking.topic, 40)}?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Yes, cancel
                        </button>
                        <button
                          onClick={() => setCancellingId(null)}
                          className="btn-ghost text-sm"
                        >
                          Keep it
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={booking.id} className="card">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-calm-900 text-sm leading-snug">
                        {booking.topic}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCfg.classes} flex-shrink-0`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>

                    <p className="text-sm text-calm-600 mb-3 leading-relaxed">
                      {truncate(booking.description, 100)}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-calm-400 mb-3">
                      <span>{booking.preferred_time}</span>
                      <span>·</span>
                      <span>{formatDate(booking.created_at)}</span>
                    </div>

                    {/* Actions */}
                    {(canEdit || canCancel) && (
                      <div className="flex gap-2 pt-3 border-t border-calm-100">
                        {canEdit && (
                          <button
                            onClick={() => startEdit(booking)}
                            className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => setCancellingId(booking.id)}
                            className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
