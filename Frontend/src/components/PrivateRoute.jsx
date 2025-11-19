import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const role = localStorage.getItem('roleName');

  // Kiểm tra role có hợp lệ và có trong allowedRoles không
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;  // Chuyển hướng về trang chính hoặc login nếu role không hợp lệ
  }

  return <Outlet />;  // Nếu role hợp lệ, tiếp tục render các route con
};

export default PrivateRoute;
