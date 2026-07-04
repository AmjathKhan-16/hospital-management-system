import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, allowed, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowed && !allowed.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
