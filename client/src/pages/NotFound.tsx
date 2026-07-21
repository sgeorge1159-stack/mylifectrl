import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold font-display text-brand-300 mb-4">404</div>
        <h1 className="text-2xl font-bold font-display text-calm-900 mb-3">
          Page not found
        </h1>
        <p className="text-calm-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
