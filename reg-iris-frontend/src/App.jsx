import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import UploadDocuments from './pages/UploadDocuments';
import RegulatorySearch from './pages/RegulatorySearch';
import RegulatoryLibrary from './pages/RegulatoryLibrary';
import TradeImpact from './pages/TradeImpact';
import RegulatoryChangeAnalysis from './pages/RegulatoryChangeAnalysis';

import './index.css';

function NotFoundPage() {
  return (
    <section className="page-header">
      <div>
        <span className="page-eyebrow">404 - PAGE NOT FOUND</span>
        <h1 className="page-title">Page not found</h1>
        <p className="page-description">
          The page you are looking for does not exist.
        </p>

        <button
          type="button"
          className="loading-button"
          onClick={() => window.location.assign('/')}
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<UploadDocuments />} />
        <Route path="library" element={<RegulatoryLibrary />} />
        <Route path="search" element={<RegulatorySearch />} />
        <Route path="impact" element={<TradeImpact />} />

        <Route
          path="regulatory-change/:id"
          element={<RegulatoryChangeAnalysis />}
        />

        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}