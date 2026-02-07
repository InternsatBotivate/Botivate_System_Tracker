import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SystemProvider } from './context/SystemContext';
import PropTypes from 'prop-types';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';

// Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Placeholder Stage Components (will be implemented next)
// Implemented as lazy/empty for now to allow App.jsx to compile while I build them
// Actually I'll create the files first or import them? 
// I'll define basic placeholders inline or import from files I am ABOUT to create.
// It's safer to rely on imports from files.
// But I haven't created Stage1...Stage11 files yet. 
// Use React.lazy? Or just create empty files for them now?
// I will create empty placeholder files for all stages in one go after this step.
// So I will assume they exist in './pages/stages/...'
// Actually the plan said 'src/stages/...'

import Stage1RequirementUpdate from './stages/Stage1RequirementUpdate';
import Stage2RequirementUnderstanding from './stages/Stage2RequirementUnderstanding';
import Stage3SampleDesign from './stages/Stage3SampleDesign';
import Stage4DesignUpdate from './stages/Stage4DesignUpdate';
import Stage5FinalDesignApproval from './stages/Stage5FinalDesignApproval';
import Stage6Testing from './stages/Stage6Testing';
import Stage7CodeReview from './stages/Stage7CodeReview';
import Stage8UserTraining from './stages/Stage8UserTraining';
import Stage9GoLive from './stages/Stage9GoLive';
import Stage10SystemIndexing from './stages/Stage10SystemIndexing';
import Stage11MISIntegration from './stages/Stage11MISIntegration';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Loading System Tracker...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />

        {/* Stages */}
        <Route path="stage-1" element={<Stage1RequirementUpdate />} />
        <Route path="stage-2" element={<Stage2RequirementUnderstanding />} />
        <Route path="stage-3" element={<Stage3SampleDesign />} />
        <Route path="stage-4" element={<Stage4DesignUpdate />} />
        <Route path="stage-5" element={<Stage5FinalDesignApproval />} />
        <Route path="stage-6" element={<Stage6Testing />} />
        <Route path="stage-7" element={<Stage7CodeReview />} />
        <Route path="stage-8" element={<Stage8UserTraining />} />
        <Route path="stage-9" element={<Stage9GoLive />} />
        <Route path="stage-10" element={<Stage10SystemIndexing />} />
        <Route path="stage-11" element={<Stage11MISIntegration />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SystemProvider>
        <AppRoutes />
      </SystemProvider>
    </AuthProvider>
  );
}

export default App;
