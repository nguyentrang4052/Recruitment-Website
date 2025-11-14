// components/RoleBasedRedirect.jsx
import { Navigate } from 'react-router-dom';

export default function RoleBasedRedirect() {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/login" replace />;

  const role = localStorage.getItem('roleName');
  if (role === 'applicant') return <Navigate to="/dashboard" replace />;
  if (role === 'employer') return <Navigate to="/employer-dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
}