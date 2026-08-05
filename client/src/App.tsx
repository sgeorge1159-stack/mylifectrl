import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Reentry from './pages/Reentry';
import Recovery from './pages/Recovery';
import Campus from './pages/Campus';
import Care from './pages/Care';
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
import InvestorDeck from './pages/InvestorDeck';
import InperiumDeck from './pages/InperiumDeck';
import DelcoPDDeck from './pages/DelcoPDDeck';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/decks/investor" element={<InvestorDeck />} />
      <Route path="/decks/inperium" element={<InperiumDeck />} />
      <Route path="/decks/delco-pd" element={<DelcoPDDeck />} />
      <Route path="/decks/delco-pd-deck.html" element={<DelcoPDDeck />} />
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Institutional vertical pages */}
      <Route path="/reentry" element={<Reentry />} />
      <Route path="/recovery" element={<Recovery />} />
      <Route path="/campus" element={<Campus />} />
      <Route path="/care" element={<Care />} />

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
