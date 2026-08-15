import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import ExamEntry from './pages/public/ExamEntry';
import TakeExam from './pages/public/TakeExam';
import ExamResults from './pages/public/ExamResults';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExamBuilder from './pages/admin/ExamBuilder';
import ExamAttempts from './pages/admin/ExamAttempts';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/exam/:id/enter" element={<ExamEntry />} />
      <Route path="/exam/:id/take" element={<TakeExam />} />
      <Route path="/exam/:id/results" element={<ExamResults />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/:id"
        element={
          <ProtectedRoute>
            <ExamBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/:id/attempts"
        element={
          <ProtectedRoute>
            <ExamAttempts />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
