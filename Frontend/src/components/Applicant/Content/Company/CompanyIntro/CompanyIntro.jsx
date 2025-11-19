import React from 'react';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios'
import './CompanyIntro.css';
import { StarRating } from '../StartRating';
import { useNavigate } from 'react-router-dom';

const CompanyIntro = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/applicant/companies");
                setCompanies(JSON.parse(typeof res.data === 'string' ? res.data : JSON.stringify(res.data)));
            } catch (thrown) {
                console.error("Chi tiết lỗi:", thrown);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, []);


    const companyPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(companies.length / companyPerPage);

    const displayCompanies = companies.slice(
        (currentPage - 1) * companyPerPage,
        currentPage * companyPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const navigate = useNavigate();
    const handleReviewClick = () => {
        navigate('/companies/reviews');
    }
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <div className="company-ranking-container">
                {displayCompanies.map((company, index) => (
                    <div key={company.employerId} className="company-card-intro">
                        <div className="company-header">
                            <span className="company-rank">#{index + 1}</span>
                            <h2 className="company-name-intro"><Link to={`/companies/${company.employerId}`}>{company.name}</Link></h2>
                        </div>

                        <div className="company-content">
                            <div className="company-logo-section">
                                <img src={company.logo} alt={company.name} className="company-logo" />
                            </div>

                            <div className="company-info">
                                <div className="rating-section">
                                    <div className="stars">
                                        <StarRating rating={company.ranking} />
                                    </div>
                                    <span className="rating-number-intro">{company.ranking}</span>
                                </div>

                                <div className="review-section">
                                    <blockquote className="company-review">
                                        {company.profile}
                                    </blockquote>
                                </div>
                            </div>

                        </div>

                        <div className="company-links">
                            <a href="/companies/reviews" className="company-link">Xem đánh giá</a>
                            <span className="link-separator">|</span>
                            <a href={`/companies/${company.employerId}`} className="company-link">Xem tin tuyển dụng</a>
                        </div>
                    </div>
                ))}
            </div>
            <div className="share-section">
                <h2 className="share-title">Chia sẻ kinh nghiệm?</h2>
                <p className="share-description">
                    Chỉ mất một phút! Đánh giá ẩn danh của bạn có giá trị đối với hàng triệu người tìm việc
                </p>
                <button className="share-button" onClick={handleReviewClick}>
                    Viết đánh giá
                </button>
            </div>
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default CompanyIntro;