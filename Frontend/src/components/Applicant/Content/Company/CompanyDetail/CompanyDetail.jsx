import { MapPin, Briefcase, Star, Users, Calendar, Building2 } from 'lucide-react';
import './CompanyDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios"
import { StarRating } from '../StartRating';
import { formatDate } from '../../../../../utils/Format'
import { BsCalendarDate } from "react-icons/bs";
import companyImage from '../../../../../assets/company-image.jpg'
import { formatRangeShort } from '../../../../../utils/formatSalary';

// Hàm làm sạch HTML
const sanitizeHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const scripts = temp.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(el => el.remove());

    const all = temp.querySelectorAll('*');
    all.forEach(el => {
        [...el.attributes].forEach(attr => {
            if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
        });
    });

    return temp.innerHTML;
};


function CompanyDetail() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { employerId } = useParams();
    const [companyDetail, setCompanyDetail] = useState(null);
    const [jobListings, setJobListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [detailRes, jobRes] = await Promise.all([
                    axios.get(`${API_URL}/api/applicant/companies/detail`, { params: { id: employerId } }),
                    axios.get(`${API_URL}/api/applicant/companies/job`, { params: { id: employerId } })
                ]);
                setCompanyDetail(detailRes.data);
                setJobListings(jobRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (employerId) fetchAll();
    }, [employerId]);

    const viewDetail = (rnid) => {
        navigate(`/recruitment/${rnid}`);
    }

    const reviewDetail = (employerId) => {
        navigate(`/companies/reviews/${employerId}`);
    }

    if (loading) return <div className="loading">Loading…</div>;
    if (!companyDetail || !jobListings) return <div className="error">No data</div>;

    return (
        <div className="company-detail-page">
            <div className="company-banner">
                <div className="banner-image">
                    {companyDetail && companyDetail.image ? (
                        <img src={companyDetail.image} alt="banner" />
                    ) : (
                        <img src={companyImage} alt="default banner" />
                    )}
                </div>
                <div className="banner-overlay">
                    <div className="banner-content">
                        <div className="company-header-info">
                            <div className="company-logo-large">
                                <img src={companyDetail.logo} alt="logo" />
                            </div>
                            <div className="company-title-section">
                                <h1 className="company-name-large">{companyDetail.name}</h1>
                                <div className="company-quick-info">
                                    <MapPin size={16} />
                                    <span>{companyDetail.address}</span>
                                </div>
                                <div className="company-actions">
                                    <button className="btn-write-review" onClick={() => reviewDetail(companyDetail.employerId)}>
                                        Viết đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="company-stats">
                            <div className="rating-box">
                                <p>{companyDetail.ranking}</p>
                                <div className="rating-number"><StarRating rating={companyDetail.ranking} /></div>
                                <div className="rating-count-detail">{companyDetail.reviews} đánh giá</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-content">
                <div className="detail-grid">
                    <div className="left-column">
                        <div className="info-card">
                            <h2 className="section-title">Tổng quan</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">Quy mô công ty</div>
                                    <div className="info-value">{companyDetail.companySize}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Địa chỉ công ty</div>
                                    <div className="info-value">{companyDetail.address}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Website công ty</div>
                                    <div className="info-value">{companyDetail.companyWebsite}</div>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="overview-content">
                                <h3 className="overview-subtitle">{companyDetail.fullName}</h3>
                                <h4 className="overview-heading">Về chúng tôi</h4>
                                <div
                                    className="overview-text formatted-content"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(companyDetail.profile) }}
                                />
                            </div>
                        </div>

                        <div className="map-container">
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(companyDetail.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-link"
                            >
                                Xem trên Google Maps
                            </a>
                        </div>
                    </div>

                    <div className="right-column">
                        <div className="jobs-card">
                            <h2 className="jobs-title">{companyDetail.jobs} tin đang tuyển</h2>
                            <div className="jobs-list">
                                {jobListings.map((job) => (
                                    <div key={job.rnid} className="job-card">
                                        <h3 className="job-title-detail" onClick={() => viewDetail(job.rnid)}>
                                            {job.position}
                                        </h3>
                                        <div className="job-company-detail">
                                            <div className="job-company-logo-detail">
                                                <img src={job.employer.logo} alt="logo" />
                                            </div>
                                            <span className="job-company-name">{job.employer.name}</span>
                                        </div>
                                        <div className="job-salary">
                                            <span className="salary-icon">💰</span>
                                            <p className="salary">{formatRangeShort(job.salary)}</p>
                                        </div>
                                        <div className="job-meta">
                                            <div className="job-benefit-text">
                                                <Briefcase size={13} />
                                                <div
                                                    className="benefit-content formatted-content"
                                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.benefit) }}
                                                />
                                            </div>
                                            <div className="job-meta-item">
                                                <MapPin size={14} />
                                                <span>{job.employer.address}</span>
                                            </div>
                                            <div className="job-posted-detail">
                                                <BsCalendarDate /> Hạn nộp {formatDate(job.deadline)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetail;