import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import LoanApprovals from './pages/LoanApprovals';
import LoanApply from './pages/LoanApply';
import LoanDetails from './pages/LoanDetails';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Role-based Dashboard */}
        <Route path="dashboard" element={
          user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />
        } />
        
        {/* Admin Specific Routes */}
        <Route path="users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="approvals" element={<ProtectedRoute role="admin"><LoanApprovals /></ProtectedRoute>} />
        <Route path="active-loans" element={<ProtectedRoute role="admin"><LoanApprovals status="approved" /></ProtectedRoute>} />
        
        {/* User Specific Routes */}
        <Route path="apply" element={<LoanApply />} />
        <Route path="loan/:id" element={<LoanDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
