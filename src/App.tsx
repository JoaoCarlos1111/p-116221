import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/pages/Dashboard'
import KanbanBoard from '@/pages/KanbanBoard'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import CaseDetails from '@/pages/CaseDetails'
import Prospeccao from '@/pages/Prospeccao';
import Auditoria from './pages/Auditoria';
import AuditoriaCaseDetails from './pages/AuditoriaCaseDetails';
import Logistics from './pages/Logistics';
import LogisticsCaseView from './pages/LogisticsCaseView';
import IPTools from './pages/IPTools'
import IPToolsCaseView from './pages/IPToolsCaseView';
import Atendimento from './pages/Atendimento';
import AtendimentoCaseDetails from "@/pages/AtendimentoCaseDetails";
import Approvals from "@/pages/Approvals";
import Financeiro from "@/pages/Financeiro";
import FinanceiroDetails from "@/pages/FinanceiroDetails";
import Analytics from "@/pages/Analytics";
import AdminPermissions from './pages/AdminPermissions';
import AdminUsers from './pages/AdminUsers';
import Audit from './pages/Audit';
import CaseHistoryDetails from './pages/CaseHistoryDetails';
import BrandsAndClients from './pages/BrandsAndClients';
import BrandDetails from './pages/BrandDetails';
import TopBar from "@/components/TopBar";
import InternalLogin from "@/pages/InternalLogin";
import RouteGuard from "@/components/RouteGuard";
import { departments } from './constants';
import AdminTemplates from './pages/AdminTemplates';
import AdminSettings from './pages/AdminSettings';
import ClientDashboard from './pages/ClientDashboard';
import AnalistaContrafacaoDashboard from './pages/AnalistaContrafacaoDashboard';
import FinanceiroDashboard from './pages/FinanceiroDashboard';
import NewTemplate from './pages/NewTemplate';

function AppContent() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {location.pathname !== '/login' && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {location.pathname !== '/login' && <TopBar />}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/login" element={<InternalLogin />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } />
            <Route path="/kanban/:sector" element={
              <RouteGuard>
                <KanbanBoard />
              </RouteGuard>
            } />
            <Route path="/profile" element={
              <RouteGuard>
                <Profile />
              </RouteGuard>
            } />
            <Route path="/settings" element={
              <RouteGuard>
                <Settings />
              </RouteGuard>
            } />
            <Route path="/case/:id" element={
              <RouteGuard>
                <CaseDetails />
              </RouteGuard>
            } />
            <Route path="/prospeccao" element={
              <RouteGuard requiredDepartment={departments.PROSPECCAO}>
                <Prospeccao />
              </RouteGuard>
            } />
            <Route path="/auditoria" element={
              <RouteGuard requiredDepartment={departments.AUDITORIA}>
                <Auditoria />
              </RouteGuard>
            } />
            <Route path="/auditoria/caso/:id" element={
              <RouteGuard requiredDepartment={departments.AUDITORIA}>
                <AuditoriaCaseDetails />
              </RouteGuard>
            } />
            <Route path="/logistica" element={
              <RouteGuard requiredDepartment={departments.LOGISTICA}>
                <Logistics />
              </RouteGuard>
            } />
            <Route path="/logistica/caso/:id" element={
              <RouteGuard requiredDepartment={departments.LOGISTICA}>
                <LogisticsCaseView />
              </RouteGuard>
            } />
            <Route path="/iptools" element={
              <RouteGuard requiredDepartment={departments.IP_TOOLS}>
                <IPTools />
              </RouteGuard>
            } />
            <Route path="/iptools/case/:id" element={
              <RouteGuard requiredDepartment={departments.IP_TOOLS}>
                <IPToolsCaseView />
              </RouteGuard>
            } />
            <Route path="/atendimento" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <Atendimento />
              </RouteGuard>
            } />
            <Route path="/atendimento/caso/:id" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <AtendimentoCaseDetails />
              </RouteGuard>
            } />
            <Route path="/approvals" element={
              <RouteGuard requiredDepartment={departments.APROVACAO}>
                <Approvals />
              </RouteGuard>
            } />
            <Route path="/financeiro" element={
              <RouteGuard requiredDepartment={departments.FINANCEIRO}>
                <Financeiro />
              </RouteGuard>
            } />
            <Route path="/financeiro/:id" element={
              <RouteGuard requiredDepartment={departments.FINANCEIRO}>
                <FinanceiroDetails />
              </RouteGuard>
            } />
            <Route path="/analytics" element={
              <RouteGuard>
                <Analytics />
              </RouteGuard>
            } />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/permissions" element={<AdminPermissions />} />
              <Route path="/admin/brands" element={
                <RouteGuard requiredDepartment={["admin", "analyst"]}>
                  <BrandsAndClients />
                </RouteGuard>
              } />
              <Route path="/admin/brands/:id" element={
                <RouteGuard requiredDepartment={["admin", "analyst"]}>
                  <BrandDetails />
                </RouteGuard>
              } />
              <Route path="/admin/audit" element={
                <RouteGuard requiredDepartment="admin">
                  <Audit />
                </RouteGuard>
              } />
            <Route path="/admin/settings" element={
              <RouteGuard requiredDepartment={['admin']}>
                <AdminSettings />
              </RouteGuard>
            } />
            <Route path="/client/dashboard" element={
              <RouteGuard requiredDepartment={['client']}>
                <ClientDashboard />
              </RouteGuard>
            } />
            <Route path="/client/analista" element={
              <RouteGuard requiredDepartment={['client']}>
                <AnalistaContrafacaoDashboard />
              </RouteGuard>
            } />
            <Route path="/client/financeiro" element={
              <RouteGuard requiredDepartment={['client']}>
                <FinanceiroDashboard />
              </RouteGuard>
            } />
              <Route path="/admin/templates/new" element={
                <RouteGuard requiredDepartment="admin">
                  <NewTemplate />
                </RouteGuard>
              } />
              <Route path="/admin/templates" element={
                <RouteGuard requiredDepartment="admin">
                  <AdminTemplates />
                </RouteGuard>
              } />
              <Route path="/case-history/:id" element={<CaseHistoryDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
      <Toaster />
    </Router>
  )
}

export default App