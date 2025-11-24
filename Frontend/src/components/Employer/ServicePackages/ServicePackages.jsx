import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStar, faGift } from '@fortawesome/free-solid-svg-icons';
import './ServicePackages.css';
import PaymentPage from '../PaymentPage/PaymentPage.jsx';

const packageThemes = {
    'BASIC': {
        gradient: 'gradient-indigo',
        iconClass: 'indigo',
        badge: null
    },
    'STANDARD': {
        gradient: 'gradient-yellow',
        iconClass: 'yellow',
        badge: { icon: faStar, text: 'Được đề xuất' }
    },
    'PREMIUM': {
        gradient: 'gradient-green',
        iconClass: 'green',
        badge: null
    },
    'ENTERPRISE': {
        gradient: 'gradient-red',
        iconClass: 'red',
        badge: null
    }
};

const getAutoTheme = (index) => {
    const availableThemes = [
        { gradient: 'gradient-indigo', iconClass: 'indigo' },
        { gradient: 'gradient-yellow', iconClass: 'yellow' },
        { gradient: 'gradient-green', iconClass: 'green' },
        { gradient: 'gradient-purple', iconClass: 'purple' },
        { gradient: 'gradient-red', iconClass: 'red' },
        { gradient: 'gradient-blue', iconClass: 'blue' },
    ];
    return availableThemes[index % availableThemes.length];
};

const getThemeForPackage = (pkg, index) => {
    if (pkg.isRecommended) {
        return {
            gradient: 'gradient-yellow',
            iconClass: 'yellow',
            badge: { icon: faStar, text: 'Được đề xuất' }
        };
    }
    if (pkg.price === 0) {
        return {
            gradient: 'gradient-blue',
            iconClass: 'blue',
            badge: { icon: faGift, text: 'Miễn Phí' }
        };
    }

    // if (packageThemes[pkg.packageName]) {
    //     return packageThemes[pkg.packageName];
    // }
    const key = pkg.packageName?.toUpperCase().replace(/ /g, '');
    const matched = packageThemes[key];
    if (matched) return matched;
    return getAutoTheme(index);
};

function ServicePackages() {
    const [packages, setPackages] = useState([]);
    const [activePkgs, setActivePkgs] = useState([]);
    const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Bạn chưa đăng nhập');

            const employerID = localStorage.getItem('employerID');
            if (!employerID) throw new Error('Không tìm thấy employerID');

            const [packagesRes, activeRes] = await Promise.all([
                axios.get('http://localhost:8080/api/packages', {
                    headers: { Authorization: `Bearer ${token}` },
                }),

                axios
                    .get(
                        `http://localhost:8080/api/employer/transactions/active?employerID=${employerID}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    .catch((err) => {
                        console.warn('Không thể lấy gói đang hoạt động:', err.response?.status);
                        return { data: [] };
                    }),
            ]);

            setPackages(packagesRes.data);
            setActivePkgs(activeRes.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const isActive = (packageID) => activePkgs.some((p) => p.packageID === packageID);

    const daysLeft = (packageID) => {
        const pkg = activePkgs.find((p) => p.packageID === packageID);
        if (!pkg?.expiryDate) return null;
        const days = Math.ceil((new Date(pkg.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} ngày` : null;
    };

    const handleSelectPackage = async (packageName) => {
        const selected = packages.find((pkg) => pkg.packageName === packageName);
        if (!selected) return;

        if (selected.price === 0) {
            try {
                const token = localStorage.getItem('token');
                const employerID = localStorage.getItem('employerID');
                const res = await axios.post(
                    'http://localhost:8080/api/employer/transactions/activate-free',
                    { packageID: selected.packageID, employerID: Number(employerID) },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert(res.data.message);
                await fetchData();
            } catch (err) {
                alert('❌ ' + (err.response?.data?.message || err.message));
            }
            return;
        }

        setSelectedPackageDetails(selected);
    };

    const handleGoBack = () => setSelectedPackageDetails(null);

    // Function tạo features từ data có sẵn
    const generateFeatures = (pkg) => {
        const features = [];

        if (pkg.maxPosts) {
            features.push(`Đăng tối đa ${pkg.maxPosts} tin tuyển dụng`);
        } else {
            features.push('Đăng tin không giới hạn');
        }

        if (pkg.maxCvViews) {
            features.push(`Xem tối đa ${pkg.maxCvViews} CV ứng viên`);
        } else {
            features.push('Xem CV không giới hạn');
        }

        if (pkg.supportPriorityDays > 0) {
            features.push(`Ưu tiên duyệt tin trong vòng ${pkg.supportPriorityDays} ngày`);
        }

        if (pkg.has1on1Consult) {
            features.push('Tư vấn 1-1 với chuyên gia');
        }

        if (pkg.hasEmailSupport) {
            features.push('Hỗ trợ Email 24/7');
        }


        return features;
    };

    if (selectedPackageDetails)
        return <PaymentPage packageInfo={selectedPackageDetails} onGoBack={handleGoBack} />;

    if (loading) return <div className="loading-state"><p>Đang tải các gói dịch vụ...</p></div>;
    if (error) return <div className="message error"><span>⚠️</span>{error}</div>;
    if (!packages.length) return <div className="message info"><span>ℹ️</span>Không có gói nào.</div>;

    return (
        <div className="service-packages">
            <div className="call-to-action-section">
                <h1>Tìm kiếm Tài năng IT? <span className="highlight">Chọn Gói Dịch Vụ Của Bạn!</span></h1>
                <p>Nâng tầm chiến lược tuyển dụng với các gói linh hoạt, phù hợp mọi nhu cầu.</p>
            </div>

            <div className="cards-grid">
                {packages.map((pkg, index) => {
                    const theme = getThemeForPackage(pkg, index);
                    const active = isActive(pkg.packageID);
                    const days = daysLeft(pkg.packageID);
                    const isSelected = selectedPackageDetails && selectedPackageDetails.packageName === pkg.packageName;
                    const features = generateFeatures(pkg);
                    return (
                        <div
                            key={pkg.packageID}
                            className={`service-card ${pkg.isRecommended ? 'recommended' : ''} ${isSelected ? 'selected' : ''}`}
                        >
                            {theme.badge && (
                                <div className="badge">
                                    <FontAwesomeIcon icon={theme.badge.icon} /> {theme.badge.text}
                                </div>
                            )}

                            <div className="card-header">
                                <span className={`category ${theme.gradient}`}>{pkg.category}</span>
                                <h3 className="package-name">{pkg.packageName}</h3>
                                {pkg.description && <p className="description">{pkg.description}</p>}
                                <p className="price">
                                    {pkg.price === 0 ? 'Miễn phí' : `${pkg.price.toLocaleString('vi-VN')} VND`}
                                    <span className="duration"> / {pkg.duration} ngày</span>
                                </p>
                            </div>


                            <ul className="features">
                                {features.map((f, idx) => (
                                    <li key={idx}>
                                        <FontAwesomeIcon icon={faCheckCircle} className={`feature-icon ${theme.iconClass}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {active ? (
                                <div className="active-tag">
                                    Đang sử dụng {days ? `(còn ${days})` : ''}
                                </div>
                            ) : (
                                <button
                                    className={`btn ${theme.gradient}`}
                                    onClick={() => handleSelectPackage(pkg.packageName)}
                                    disabled={isSelected}
                                >
                                    {isSelected ? 'Đã Chọn Gói' : 'Chọn Gói Dịch Vụ'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ServicePackages;