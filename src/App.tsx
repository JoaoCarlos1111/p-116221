import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import Dashboard from './pages/Dashboard'
import IPTools from './pages/IPTools'
import IPToolsCaseView from './pages/IPToolsCaseView'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/iptools" element={<IPTools />} />
        <Route path="/iptools/case/:id" element={<IPToolsCaseView />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App