import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/pages/Dashboard'
import KanbanBoard from '@/pages/KanbanBoard'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import CaseDetails from '@/pages/CaseDetails'
import Prospeccao from '@/pages/Prospeccao'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban/:sector" element={<KanbanBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/case/:id" element={<CaseDetails />} />
            <Route path="/prospeccao" element={<Prospeccao />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  )
}

export default App