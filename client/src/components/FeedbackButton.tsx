import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: message.trim(), page: location.pathname }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
          setMessage('');
        }, 1500);
      }
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white border border-calm-300 shadow-lg hover:shadow-xl text-calm-500 hover:text-brand-600 hover:border-brand-300 flex items-center justify-center text-lg transition-all duration-200 active:scale-95"
        title="Send feedback"
      >
        💬
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setOpen(false); setSubmitted(false); setMessage(''); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-calm-200 p-6 w-full max-w-md z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-calm-900 text-lg">Send Feedback</h3>
              <button
                onClick={() => { setOpen(false); setSubmitted(false); setMessage(''); }}
                className="text-calm-400 hover:text-calm-600 transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">🙏</div>
                <p className="text-calm-700 font-medium">Thanks! Your feedback helps us improve.</p>
              </div>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field min-h-[120px] resize-y text-sm mb-4"
                  placeholder="Tell us what you think — suggestions, bugs, or anything on your mind..."
                  autoFocus
                  maxLength={2000}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-calm-400">{message.length}/2000</span>
                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim() || submitting}
                    className="btn-primary text-sm px-5 py-2"
                  >
                    {submitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
