import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';
const breadcrumbMap = {
  '/':                 [{ label: 'Trang chủ', link: '/dashboard' }],
  '/cv-templates':     [{ label: 'Trang chủ', link: '/dashboard' }, { label: 'Mẫu CV', link: '/cv-templates' }],
  '/recruitment/1':    [{ label: 'Trang chủ', link: '/dashboard' }, { label: 'Việc làm', link: '/recruitment/1' }, { label: 'Chi tiết tuyển dụng', link: '/recruitment/1' }],
};

export const Breadcrumb = () => {
  const location = useLocation();
  const items = breadcrumbMap[location.pathname] || [{ label: 'Trang chủ', link: '/dashboard' }];
  return (
    <nav className="breadcrumb">
      {items.map((crumb, i) => (
        <span key={i} className="crumb">
          {crumb.link ? <Link to={crumb.link}>{crumb.label}</Link> : <span>{crumb.label}</span>}
          {i < items.length - 1 && <span className="arrow" />}
        </span>
      ))}
    </nav>
  );
};