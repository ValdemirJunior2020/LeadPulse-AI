import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGate } from './components/layout/AuthGate';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardHome } from './pages/DashboardHome';
import { ClientSelector } from './pages/ClientSelector';
import { SettingsPage } from './pages/SettingsPage';
import { CampaignWizard } from './pages/CampaignWizard';
import { CampaignDrafts } from './pages/CampaignDrafts';
import { MetaIntegrationPage } from './pages/MetaIntegrationPage';
import { CallrailDashboard } from './pages/CallrailDashboard';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <AuthGate>
            <DashboardLayout />
          </AuthGate>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="clients" element={<ClientSelector />} />
        <Route path="new-campaign" element={<CampaignWizard />} />
        <Route path="drafts" element={<CampaignDrafts />} />
        <Route path="meta" element={<MetaIntegrationPage />} />
        <Route path="calls" element={<CallrailDashboard />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
