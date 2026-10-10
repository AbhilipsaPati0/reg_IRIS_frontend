
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import UploadDocuments from './pages/UploadDocuments'
import RegulatorySearch from './pages/RegulatorySearch'

import './index.css'

function PlaceholderPage({ title, description }) {
  return (
    <section className="page-header">
      <div>
        <span className="page-eyebrow">REG IRIS WORKSPACE</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">
          {description || 'This feature is being prepared.'}
        </p>
      </div>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="page-header">
      <div>
        <span className="page-eyebrow">404 · PAGE NOT FOUND</span>
        <h1 className="page-title">Page not found</h1>
        <p className="page-description">
          The page you are looking for does not exist.
        </p>
        <button
          className="loading-button"
          onClick={() => window.location.assign('/')}
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="upload" element={<UploadDocuments />} />

        <Route path="library" element={
          <PlaceholderPage
            title="Regulatory Library"
            description="Browse and manage indexed regulatory documents."
          />
        } />

        <Route path="search" element={<RegulatorySearch />} />

        <Route path="impact" element={
          <PlaceholderPage
            title="Trade Impact Analysis"
            description="Analyze trade data against regulatory rules."
          />
        } />

        <Route path="whats-new" element={
          <PlaceholderPage
            title="What's New"
            description="Review recently added regulations and updates."
          />
        } />

        <Route path="alerts" element={
          <PlaceholderPage
            title="Alerts"
            description="Review regulatory changes and compliance alerts."
          />
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
