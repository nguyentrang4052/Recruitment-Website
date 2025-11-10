import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStar, faRocket, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './ServicePackages.css';
import PaymentPage from '../PaymentPage/PaymentPage.jsx';

const packageData = {
    BASIC: {
        key: 'BASIC',
        name: "CƠ BẢN (Basic)",
        price: 5000000,
        duration: "30 Ngày",
        description: "Khởi đầu đơn giản, hiệu quả nhanh chóng cho các nhu cầu phổ biến.",
        features: ["Đăng 5 tin tuyển dụng", "Tiếp cận 100 CV", "Hỗ trợ kỹ thuật qua Email"],
        disabledFeatures: [],
        taxRate: 0.1,
    },
    STANDARD: {
        key: 'STANDARD',
        name: "TIÊU CHUẨN (Standard)",
        price: 12000000,
        duration: "90 Ngày",
        description: "Giải pháp toàn diện, tối ưu hóa quá trình tìm kiếm ứng viên tiềm năng.",
        features: ["Đăng 20 tin tuyển dụng", "Tiếp cận 500 CV cao cấp", "Tin đăng được ưu tiên 2 tuần", "Báo cáo hiệu suất hàng tuần"],
        disabledFeatures: [],
        taxRate: 0.1,
    },
    PREMIUM: {
        key: 'PREMIUM',
        name: "CAO CẤP (Premium)",
        price: 25000000,
        duration: "180 Ngày",
        description: "Sức mạnh không giới hạn để thống trị thị trường tuyển dụng.",
        features: ["Đăng tin KHÔNG GIỚI HẠN", "Truy cập TOÀN BỘ Kho CV", "Tư vấn chiến lược tuyển dụng 1-1", "Tin đăng luôn được ưu tiên"],
        disabledFeatures: [],
        taxRate: 0.1,
    }
};

function ServicePackages() {
    const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);

    const handleSelectPackage = (packageKey) => {
        setSelectedPackageDetails(packageData[packageKey]);
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

    return (
        <div className="service-packages">
            <div className="call-to-action-section">
                <h1>Tìm kiếm Tài năng IT? <span className="highlight">Chọn Gói Dịch Vụ Của Bạn!</span></h1>
                <p>Nâng tầm chiến lược tuyển dụng của bạn với các gói dịch vụ linh hoạt, phù hợp mọi nhu cầu từ cơ bản đến cao cấp.</p>
                <button className="view-details-btn">Tham khảo các gói dịch vụ </button>
            </div>

            {selectedPackageDetails && (
                <div className={`message ${selectedPackageDetails.key === 'BASIC' ? 'info' : 'success'}`}>
                    <FontAwesomeIcon icon={selectedPackageDetails.key === 'BASIC' ? faInfoCircle : faCheckCircle} className="icon" />
                    {selectedPackageDetails.key === 'BASIC' && "Bạn đã chọn gói CƠ BẢN. Nâng cấp để khám phá thêm tính năng!"}
                    {selectedPackageDetails.key === 'STANDARD' && "Bạn đã chọn gói TIÊU CHUẨN. Tận hưởng các lợi ích độc quyền!"}
                    {selectedPackageDetails.key === 'PREMIUM' && "Bạn đã chọn gói CAO CẤP. Giải pháp tuyển dụng tối ưu đã sẵn sàng!"}
                </div>
            )}


            <div className="cards-grid">

                <div className={`service-card ${selectedPackageDetails && selectedPackageDetails.key === 'BASIC' ? 'selected' : ''}`}>
                    <div className="card-header">
                        <span className="category gradient-indigo">Đăng Tin</span>
                        <h3 className="package-name">CƠ BẢN (Basic)</h3>
                        <p className="description">Khởi đầu đơn giản, hiệu quả nhanh chóng cho các nhu cầu phổ biến.</p>
                        <p className="price">{packageData.BASIC.price.toLocaleString('vi-VN')} VND <span className="duration">/ {packageData.BASIC.duration}</span></p>
                    </div>
                    <ul className="features">
                        {/* Chỉ hiển thị các tính năng CÓ trong mảng 'features' */}
                        {packageData.BASIC.features.map((feature, index) => (
                            <li key={`f-basic-${index}`}>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-icon indigo" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        className="btn gradient-indigo"
                        onClick={() => handleSelectPackage('BASIC')}
                        disabled={selectedPackageDetails && selectedPackageDetails.key === 'BASIC'}
                    >
                        {selectedPackageDetails && selectedPackageDetails.key === 'BASIC' ? 'Đã Chọn Gói' : 'Chọn Gói Dịch Vụ'}
                    </button>
                </div>


                <div className={`service-card recommended ${selectedPackageDetails && selectedPackageDetails.key === 'STANDARD' ? 'selected' : ''}`}>
                    <div className="badge">
                        <FontAwesomeIcon icon={faStar} className="icon" /> Được đề xuất
                    </div>
                    <div className="card-header">
                        <span className="category gradient-yellow">Tuyển Dụng Toàn Diện</span>
                        <h3 className="package-name">TIÊU CHUẨN (Standard)</h3>
                        <p className="description">Giải pháp toàn diện, tối ưu hóa quá trình tìm kiếm ứng viên tiềm năng.</p>
                        <p className="price">{packageData.STANDARD.price.toLocaleString('vi-VN')} VND <span className="duration">/ {packageData.STANDARD.duration}</span></p>
                    </div>
                    <ul className="features">
                        {/* Chỉ hiển thị các tính năng CÓ trong mảng 'features' */}
                        {packageData.STANDARD.features.map((feature, index) => (
                            <li key={`f-standard-${index}`}>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-icon yellow" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        className="btn gradient-yellow"
                        onClick={() => handleSelectPackage('STANDARD')}
                        disabled={selectedPackageDetails && selectedPackageDetails.key === 'STANDARD'}
                    >
                        {selectedPackageDetails && selectedPackageDetails.key === 'STANDARD' ? 'Đã Chọn Gói' : 'Chọn Gói Dịch Vụ'}
                    </button>
                </div>


                <div className={`service-card ${selectedPackageDetails && selectedPackageDetails.key === 'PREMIUM' ? 'selected' : ''}`}>
                    <div className="badge">
                        <FontAwesomeIcon icon={faRocket} className="icon" /> Nổi bật nhất
                    </div>
                    <div className="card-header">
                        <span className="category gradient-green">Truy Cập Không Giới Hạn</span>
                        <h3 className="package-name">CAO CẤP (Premium)</h3>
                        <p className="description">Sức mạnh không giới hạn để thống trị thị trường tuyển dụng.</p>
                        <p className="price">{packageData.PREMIUM.price.toLocaleString('vi-VN')} VND <span className="duration">/ {packageData.PREMIUM.duration}</span></p>
                    </div>
                    <ul className="features">

                        {packageData.PREMIUM.features.map((feature, index) => (
                            <li key={`f-premium-${index}`}>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-icon green" /> {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        className="btn gradient-green"
                        onClick={() => handleSelectPackage('PREMIUM')}
                        disabled={selectedPackageDetails && selectedPackageDetails.key === 'PREMIUM'}
                    >
                        {selectedPackageDetails && selectedPackageDetails.key === 'PREMIUM' ? 'Đã Chọn Gói' : 'Chọn Gói Dịch Vụ'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ServicePackages;