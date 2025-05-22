
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import Sidebar from '@/components/Sidebar'
import Dashboard from './pages/Dashboard'
import IPTools from './pages/IPTools'
import IPToolsCaseView from './pages/IPToolsCaseView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/iptools" element={<IPTools />} />
            <Route path="/iptools/case/:id" element={<IPToolsCaseView />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  )
}

export default App
