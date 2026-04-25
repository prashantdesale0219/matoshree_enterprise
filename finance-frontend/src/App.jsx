import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing'; // Eager load landing page

// Lazy load other pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const LoanApprovals = lazy(() => import('./pages/LoanApprovals'));
const LoanApply = lazy(() => import('./pages/LoanApply'));
const LoanDetails = lazy(() => import('./pages/LoanDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Better loading fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-secondary rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-primary rounded-lg animate-pulse"></div>
      </div>
    </div>
    <p className="mt-6 text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
      Matoshree Enterprise
    </p>
  </div>
);

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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        
        <Route path="/app" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
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
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Support legacy paths by redirecting to /app/... */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/users" element={<Navigate to="/app/users" replace />} />
        <Route path="/approvals" element={<Navigate to="/app/approvals" replace />} />
        <Route path="/active-loans" element={<Navigate to="/app/active-loans" replace />} />
        <Route path="/apply" element={<Navigate to="/app/apply" replace />} />
        <Route path="/loan/:id" element={<Navigate to="/app/loan/:id" replace />} />
        <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
        <Route path="/notifications" element={<Navigate to="/app/notifications" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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
