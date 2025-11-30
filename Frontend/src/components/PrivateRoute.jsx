import { Navigate, Outlet } from 'react-router-dom';
import ErrorPage from './ErrorPage/ErrorPage.jsx';

const PrivateRoute = ({ allowedRoles }) => {
  const role = localStorage.getItem('roleName');
  const token = localStorage.getItem('token');

  // if (!role || !allowedRoles.includes(role)) {
  //   return <Navigate to="/login" replace />;  
  // }

  if (!token) {
    return <ErrorPage errorType="401" />;
  }

  if (!allowedRoles.includes(role)) {
    // Không đủ quyền
    return <ErrorPage errorType="403" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
