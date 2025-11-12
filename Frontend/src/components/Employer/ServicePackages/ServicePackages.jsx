import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStar, faRocket, faCrown } from '@fortawesome/free-solid-svg-icons';
import './ServicePackages.css';
import PaymentPage from '../PaymentPage/PaymentPage.jsx';

// Cấu hình theme cho các gói cố định
const packageThemes = {
    BASIC: {
        gradient: 'gradient-indigo',
        iconClass: 'indigo',
        badge: null
    },
    STANDARD: {
        gradient: 'gradient-yellow',
        iconClass: 'yellow',
        badge: { icon: faStar, text: 'Được đề xuất' }
    },
    PREMIUM: {
        gradient: 'gradient-green',
        iconClass: 'green',
        badge: { icon: faRocket, text: 'Nổi bật nhất' }
    },
    VIP: {
        gradient: 'gradient-purple',
        iconClass: 'purple',
        badge: { icon: faCrown, text: 'VIP Exclusive' }
    }
};

// Hàm tự động gán theme cho gói mới từ database
const getAutoTheme = (index) => {
    const availableThemes = [
        { gradient: 'gradient-indigo', iconClass: 'indigo', badge: null },
        { gradient: 'gradient-yellow', iconClass: 'yellow', badge: null },
        { gradient: 'gradient-green', iconClass: 'green', badge: null },
        { gradient: 'gradient-purple', iconClass: 'purple', badge: null },
        { gradient: 'gradient-red', iconClass: 'red', badge: null },
        { gradient: 'gradient-blue', iconClass: 'blue', badge: null },
    ];
    // Dùng index để gán màu xen kẽ, tránh trùng lặp
    return availableThemes[index % availableThemes.length];
};

function ServicePackages() {
    const [packages, setPackages] = useState([]);
    const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            // Mock data từ database
            const mockData = [
                {
                    key: 'BASIC',
                    name: "CƠ BẢN (Basic)",
                    price: 5000000,
                    duration: "30 Ngày",
                    category: "Đăng Tin",
                    description: "Khởi đầu đơn giản, hiệu quả nhanh chóng cho các nhu cầu phổ biến.",
                    features: ["Đăng 5 tin tuyển dụng", "Tiếp cận 100 CV", "Hỗ trợ kỹ thuật qua Email"],
                    taxRate: 0.1,
                    isRecommended: false
                },
                {
                    key: 'STANDARD',
                    name: "TIÊU CHUẨN (Standard)",
                    price: 12000000,
                    duration: "90 Ngày",
                    category: "Tuyển Dụng Toàn Diện",
                    description: "Giải pháp toàn diện, tối ưu hóa quá trình tìm kiếm ứng viên tiềm năng.",
                    features: [
                        "Đăng 20 tin tuyển dụng",
                        "Tiếp cận 500 CV cao cấp",
                        "Tin đăng được ưu tiên 2 tuần",
                        "Báo cáo hiệu suất hàng tuần"
                    ],
                    taxRate: 0.1,
                    isRecommended: true
                },
                {
                    key: 'PREMIUM',
                    name: "CAO CẤP (Premium)",
                    price: 25000000,
                    duration: "180 Ngày",
                    category: "Truy Cập Không Giới Hạn",
                    description: "Sức mạnh không giới hạn để thống trị thị trường tuyển dụng.",
                    features: [
                        "Đăng tin KHÔNG GIỚI HẠN",
                        "Truy cập TOÀN BỘ Kho CV",
                        "Tư vấn chiến lược tuyển dụng 1-1",
                        "Tin đăng luôn được ưu tiên"
                    ],
                    taxRate: 0.1,
                    isRecommended: false
                },
                {
                    key: 'VIP',
                    name: "VIP ENTERPRISE",
                    price: 50000000,
                    duration: "365 Ngày",
                    category: "Doanh Nghiệp Lớn",
                    description: "Giải pháp toàn diện cho doanh nghiệp có nhu cầu tuyển dụng quy mô lớn.",
                    features: [
                        "Tất cả tính năng Premium",
                        "Dedicated Account Manager",
                        "Headhunting Service",
                        "Custom Branding",
                        "API Integration"
                    ],
                    taxRate: 0.1,
                    isRecommended: false
                },
                // Gói mới từ database sẽ tự động có màu
                {
                    key: 'NEW_PACKAGE',
                    name: "GÓI THỬ NGHIỆM",
                    price: 1000000,
                    duration: "7 Ngày",
                    category: "Dùng Thử",
                    description: "Trải nghiệm tính năng cao cấp trong thời gian ngắn.",
                    features: ["Đăng 3 tin tuyển dụng", "Tiếp cận 50 CV", "Hỗ trợ 24/7"],
                    taxRate: 0.1,
                    isRecommended: false
                }
            ];

            setTimeout(() => {
                setPackages(mockData);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching packages:', error);
            setLoading(false);
        }
    };

    const handleSelectPackage = (packageKey) => {
        const selected = packages.find(pkg => pkg.key === packageKey);
        setSelectedPackageDetails(selected);
    };

    const handleGoBack = () => {
        setSelectedPackageDetails(null);
    };

    if (selectedPackageDetails) {
        return (
            <PaymentPage
                packageInfo={selectedPackageDetails}
                onGoBack={handleGoBack}
            />
        );
    }

    if (loading) {
        return (
            <div className="service-packages">
                <div className="loading-state">
                    <p>Đang tải các gói dịch vụ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="service-packages">
            <div className="call-to-action-section">
                <h1>
                    Tìm kiếm Tài năng IT? <span className="highlight">Chọn Gói Dịch Vụ Của Bạn!</span>
                </h1>
                <p>
                    Nâng tầm chiến lược tuyển dụng của bạn với các gói dịch vụ linh hoạt,
                    phù hợp mọi nhu cầu từ cơ bản đến cao cấp.
                </p>
                <button className="view-details-btn">Tham khảo các gói dịch vụ</button>
            </div>

            <div className="cards-grid">
                {packages.map((pkg, index) => {
                    // Lấy theme từ config hoặc tự động gán
                    const baseTheme = packageThemes[pkg.key];
                    const theme = baseTheme || getAutoTheme(index);
                    const isSelected = selectedPackageDetails && selectedPackageDetails.key === pkg.key;

                    return (
                        <div
                            key={pkg.key}
                            className={`service-card ${pkg.isRecommended ? 'recommended' : ''} ${isSelected ? 'selected' : ''}`}
                        >
                            {theme.badge && (
                                <div className="badge">
                                    <FontAwesomeIcon icon={theme.badge.icon} className="icon" />
                                    {theme.badge.text}
                                </div>
                            )}

                            <div className="card-header">
                                <span className={`category ${theme.gradient}`}>
                                    {pkg.category}
                                </span>
                                <h3 className="package-name">{pkg.name}</h3>
                                <p className="description">{pkg.description}</p>
                                <p className="price">
                                    {pkg.price.toLocaleString('vi-VN')} VND
                                    <span className="duration"> / {pkg.duration}</span>
                                </p>
                            </div>

                            <ul className="features">
                                {pkg.features.map((feature, idx) => (
                                    <li key={`${pkg.key}-feature-${idx}`}>
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className={`feature-icon ${theme.iconClass}`}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`btn ${theme.gradient}`}
                                onClick={() => handleSelectPackage(pkg.key)}
                                disabled={isSelected}
                            >
                                {isSelected ? 'Đã Chọn Gói' : 'Chọn Gói Dịch Vụ'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ServicePackages;