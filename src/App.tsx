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
import AtendimentoDashboard from './pages/AtendimentoDashboard';
import CentralAtendimento from './pages/CentralAtendimento';
import Integracoes from './pages/Integracoes';
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
import RouteGuard, { AuthProvider } from "@/components/RouteGuard";
import { departments } from './constants';
import AdminTemplates from './pages/AdminTemplates';
import AdminSettings from './pages/AdminSettings';
import ClientDashboard from './pages/ClientDashboard';
import AnalistaContrafacaoDashboard from './pages/client/AnalistaContrafacaoDashboard';
import FaturasPagamentos from './pages/client/FaturasPagamentos';
import HistoricoPagamentos from './pages/client/HistoricoPagamentos';
import DetalhesServicos from './pages/client/DetalhesServicos';
import ContratosDocumentos from './pages/client/ContratosDocumentos';
import Solicitacoes from './pages/client/Solicitacoes';
import GestorDashboard from './pages/client/GestorDashboard';
import GestorCasos from './pages/client/GestorCasos';
import GestorUsuarios from './pages/client/GestorUsuarios';
import FinanceiroDashboard from './pages/client/FinanceiroDashboard';
import NewTemplate from './pages/NewTemplate';
import CasesHistory from './pages/client/CasesHistory';
import TelaFixa from './pages/TelaFixa';

function AppContent() {
  const location = useLocation();

  // Defina aqui as rotas que não devem ter sidebar
  const routesWithoutSidebar = ['/login', '/tela-fixa'];
  const shouldShowSidebar = !routesWithoutSidebar.includes(location.pathname);

  return (
    <div className="flex h-screen bg-background">
      {shouldShowSidebar && <Sidebar />}
      <div className={`flex flex-col ${shouldShowSidebar ? 'flex-1' : 'w-full'}`}>
        {shouldShowSidebar && <TopBar />}
        <main className={`flex-1 overflow-y-auto ${shouldShowSidebar ? 'p-8' : 'p-0'}`}>
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
            <Route path="/atendimento/pipeline" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <Atendimento />
              </RouteGuard>
            } />
            <Route path="/atendimento/dashboard" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <AtendimentoDashboard />
              </RouteGuard>
            } />
            <Route path="/atendimento/central" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <CentralAtendimento />
              </RouteGuard>
            } />
            <Route path="/atendimento/caso/:id" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <AtendimentoCaseDetails />
              </RouteGuard>
            } />
            <Route path="/atendimento/integracoes" element={
              <RouteGuard requiredDepartment={departments.ATENDIMENTO}>
                <Integracoes />
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
            <Route path="/client/analista/dashboard" element={
              <RouteGuard requiredDepartment={['client']}>
                <AnalistaContrafacaoDashboard />
              </RouteGuard>
            } />
            <Route path="/client/analista/approvals" element={
              <RouteGuard requiredDepartment={['client']}>
                <Approvals />
              </RouteGuard>
            } />
            <Route path="/client/financeiro/dashboard" element={
              <RouteGuard requiredDepartment={['client']}>
                <FinanceiroDashboard />
              </RouteGuard>
            } />
             <Route path="/client/financeiro/faturas" element={
              <RouteGuard requiredDepartment={['client']}>
                <FaturasPagamentos />
              </RouteGuard>
            } />
             <Route path="/client/financeiro/historico" element={
              <RouteGuard requiredDepartment={['client']}>
                <HistoricoPagamentos />
              </RouteGuard>
            } />
             <Route path="/client/financeiro/servicos" element={
              <RouteGuard requiredDepartment={['client']}>
                <DetalhesServicos />
              </RouteGuard>
            } />
            <Route path="/client/gestor/dashboard" element={
              <RouteGuard requiredDepartment={['client']}>
                <GestorDashboard />
              </RouteGuard>
            } />
            <Route path="/client/gestor/casos" element={
              <RouteGuard requiredDepartment={['client']}>
                <GestorCasos />
              </RouteGuard>
            } />
            <Route path="/client/gestor/usuarios" element={
              <RouteGuard requiredDepartment={['client']}>
                <GestorUsuarios />
              </RouteGuard>
            } />
            <Route path="/client/gestor/aprovacoes" element={
              <RouteGuard requiredDepartment={['client']}>
                <Approvals />
              </RouteGuard>
            } />
            <Route path="/client/gestor/financeiro" element={
              <RouteGuard requiredDepartment={['client']}>
                <FinanceiroDashboard />
              </RouteGuard>
            } />
            <Route path="/client/gestor/marcas" element={
              <RouteGuard requiredDepartment={['client']}>
                <BrandsAndClients />
              </RouteGuard>
            } />
            <Route path="/client/gestor/relatorios" element={
              <RouteGuard requiredDepartment={['client']}>
                <Analytics />
              </RouteGuard>
            } />
             <Route path="/client/financeiro/documentos" element={
              <RouteGuard requiredDepartment={['client']}>
                <ContratosDocumentos />
              </RouteGuard>
            } />
             <Route path="/client/financeiro/solicitacoes" element={
              <RouteGuard requiredDepartment={['client']}>
                <Solicitacoes />
              </RouteGuard>
            } />
              <Route path="/client/financeiro/solicitacoes" element={
              <RouteGuard requiredDepartment={['client']}>
                <Solicitacoes />
              </RouteGuard>
            } />
            <Route path="/client/approvals" element={
              <RouteGuard requiredDepartment={['client']}>
                <Approvals />
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
              <Route path="/client/casos/historico" element={<CasesHistory />} />
            <Route path="/tela-fixa" element={<TelaFixa />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App