import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PrivateRoute({ children, roles }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
