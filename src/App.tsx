import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import KanbanBoard from '@/pages/KanbanBoard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import CaseDetails from '@/pages/CaseDetails';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/kanban/:sector" element={<KanbanBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/case/:id" element={<CaseDetails />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;