import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Signup failed');
        return;
      }
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      navigate('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold font-display text-calm-900">
            <span className="text-brand-500">◈</span> LIFECTRL
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-calm-900">Create your account</h1>
          <p className="mt-2 text-calm-600">Start turning chaos into clarity.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-calm-700 mb-1.5">Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="input-field" placeholder="Jane Smith" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-calm-700 mb-1.5">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="jane@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-calm-700 mb-1.5">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="At least 8 characters" required minLength={8} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-calm-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
