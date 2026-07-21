import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import DocumentStudio from './pages/DocumentStudio';
import LifeVault from './pages/LifeVault';
import LifeKits from './pages/LifeKits';
import KitDetail from './pages/KitDetail';
import Concierge from './pages/Concierge';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes — wrapped in auth guard + Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:id" element={<PlanDetail />} />
          <Route path="/docs" element={<DocumentStudio />} />
          <Route path="/vault" element={<LifeVault />} />
          <Route path="/kits" element={<LifeKits />} />
          <Route path="/kits/:id" element={<KitDetail />} />
          <Route path="/concierge" element={<Concierge />} />
        </Route>
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
