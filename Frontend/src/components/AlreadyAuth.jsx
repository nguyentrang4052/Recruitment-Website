// components/AlreadyAuth.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function AlreadyAuth() {
  const token = localStorage.getItem('accessToken'); // hoặc kiểm tra theo cách bạn lưu token
  if (token) {
    const role = localStorage.getItem('roleName');
    if (role === 'applicant') return <Navigate to="/dashboard" replace />;
    if (role === 'employer') return <Navigate to="/employer-dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}