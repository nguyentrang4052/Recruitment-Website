import { Link, useParams } from 'react-router-dom';
import './Breadcrumb.css';
import { useState, useEffect } from 'react';
import axios from "axios"
import { useLocation } from 'react-router-dom';


export const Breadcrumb = () => {
  const { employerId } = useParams()
  const { rnid } = useParams()
  const location = useLocation();
  const [detail, setCompanyDetail] = useState(null);
  const [loadingC, setLoadingC] = useState(Boolean(employerId));
  const [loadingR, setLoadingR] = useState(Boolean(rnid));


  useEffect(() => {
    if (!employerId) return;
    setLoadingC(true);
    axios.get("http://localhost:8080/api/applicant/companies/detail", { params: { id: employerId } })
      .then(res => setCompanyDetail(res.data))
      .finally(() => setLoadingC(false));
  }, [employerId]);

  const [recruitmentDetail, setRecruitmentDetail] = useState(null);
  useEffect(() => {
    if (!rnid) return;
    setLoadingR(true);
    axios.get("http://localhost:8080/api/detail", { params: { id: rnid } })
      .then(res => setRecruitmentDetail(res.data))
      .finally(() => setLoadingR(false));
  }, [rnid]);


  const breadcrumbMap = () => {
    const base = [
      { label: 'Trang chủ', link: '/dashboard' }


    ];

    if (location.pathname.startsWith('/companies/reviews/')) {
      // Breadcrumb cho trang đánh giá công ty
      base.push(
        { label: 'Đánh giá công ty', link: '/companies/reviews' },
        {
          label: detail?.name || 'Đang tải...',
          link: `/companies/reviews/${employerId}`
        }
      );
    } else if (location.pathname.startsWith('/companies/') && employerId) {
      // Breadcrumb cho trang chi tiết công ty
      base.push(
        { label: 'Công ty', link: '/companies' },
        {
          label: detail?.name || 'Đang tải...',
          link: `/companies/${employerId}`
        }
      );
    }
    if (location.pathname.startsWith('/recruitment/') && rnid) {
      base.push(
        {
          label: recruitmentDetail?.position || 'Đang tải...',
          link: `/recruitment/${rnid}`
        });
    }



    const pathLabels = {
      '/cv-templates': 'Mẫu CV',
      '/about': 'Về chúng tôi',
      '/profile': 'Hồ sơ cá nhân',
      '/apply-jobs': 'Việc làm đã ứng tuyển',
      '/save-jobs': 'Việc làm đã lưu',
      '/notifications': 'Thông báo việc làm',
      '/settings': 'Cài đặt tài khoản',
    };

    const label = pathLabels[location.pathname];

    return label ? [...base.slice(0, 1), { label, link: location.pathname }] : base;

  };

  const items = breadcrumbMap();

  const showLoading = (employerId && loadingC) || (rnid && loadingR);
  if (showLoading) return <div>Loading...</div>;
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