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
  //   const fetchDetail = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8080/api/applicant/companies/detail", { params: { id: employerId } })
  //       setCompanyDetail(res.data);
  //     } catch (thrown) {
  //       console.error("Chi tiết lỗi:", thrown);
  //     } finally {
  //       setLoadingC(false);
  //     }
  //   };
  //   if (employerId) fetchDetail();
  // }, [employerId]);
    if (!employerId) return;
  setLoadingC(true);
  axios.get("http://localhost:8080/api/applicant/companies/detail", {params: {id: employerId}})
       .then(res => setCompanyDetail(res.data))
       .finally(() => setLoadingC(false));
}, [employerId]);

  const [recruitmentDetail, setRecruitmentDetail] = useState(null);
  useEffect(() => {
  //   const fetchDetail = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8080/api/detail", { params: { id: rnid } });
  //       setRecruitmentDetail(response.data);
  //     }
  //     catch (error) {
  //       console.error("Lỗi khi tải chi tiết tin tuyển dụng", error);
  //       setLoadingR(false)
  //     }
  //   };
  //   if (rnid) fetchDetail();
  // }, [rnid]);
  if (!rnid) return;
  setLoadingR(true);
  axios.get("http://localhost:8080/api/detail", {params: {id: rnid}})
       .then(res => setRecruitmentDetail(res.data))
       .finally(() => setLoadingR(false));
}, [rnid]);


  const breadcrumbMap = () => {
    const base = [
      { label: 'Trang chủ', link: '/dashboard' }


    ];

    if (location.pathname.startsWith('/companies/') && employerId) {
      base.push(
        { label: 'Công ty', link: '/companies' },
        {
          label: detail?.name || 'Đang tải...',
          link: `/companies/${employerId}`
        });
    }
    if (location.pathname.startsWith('/recruitment/') && rnid) {
      base.push(
        // { label: 'Tìm kiếm việc làm', link: '/dashboard' },
        {
          label: recruitmentDetail?.position || 'Đang tải...',
          link: `/recruitment/${rnid}`
        });
    }


    // các route cố định khác
    if (location.pathname === '/cv-templates') {
      return [...base.slice(0, 1), { label: 'Mẫu CV', link: '/cv-templates' }];
    }else if (location.pathname === '/about') {
      return [...base.slice(0, 1), { label: 'Về chúng tôi', link: '/about' }];
    }
    // if (location.pathname === '/recruitment') {
    //   return [...base.slice(0, 1), { label: 'Việc làm', link: '/recruitment' }];
    // }
    // thêm các case khác nếu cần

    return base;
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