import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import TopBar from "@/components/TopBar";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban/:sector" element={<KanbanBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/case/:id" element={<CaseDetails />} />
            <Route path="/prospeccao" element={<Prospeccao />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/auditoria/caso/:id" element={<AuditoriaCaseDetails />} />
            <Route path="/logistica" element={<Logistics />} />
        <Route path="/logistica/caso/:id" element={<LogisticsCaseView />} />
            <Route path="/iptools" element={<IPTools />} />
            <Route path="/iptools/case/:id" element={<IPToolsCaseView />} />
            <Route path="/atendimento" element={<Atendimento />} />
            <Route path="/atendimento/caso/:id" element={<AtendimentoCaseDetails />} />
            <Route path="/approvals" element={<Approvals />} />
          </Routes>
        </main>
        </div>
      </div>
      <Toaster />
    </Router>
  )
}

export default App