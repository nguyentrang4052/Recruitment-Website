import React, { useState, useEffect, useRef } from 'react';
import '../../Employer/CompanyManagement/CompanyManagement.css';
import provincesData from '../../../../data/provinces.json';
import wardsData from '../../../../data/wards.json';

const CompanyManagement = () => {
    const [companyInfo, setCompanyInfo] = useState({
        // giả lập dữ liệu công ty
        name: 'Tên Công ty của bạn',
        contactPerson: 'Nguyễn Văn A',
        registeredProvince: '',
        registeredWard: '',
        detailedAddress: '',
        phone: '0281234567',
        website: 'https://www.congty.com',
        description: 'Mô tả ngắn gọn về công ty của bạn, chuyên về công nghệ thông tin và phát triển phần mềm...',
        logo: null,
        logoPreview: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setProvinces(provincesData);
        const initialWards = wardsData.filter(ward => ward.province_id.toString() === companyInfo.registeredProvince);
        setWards(initialWards);
    }, [companyInfo.registeredProvince]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));

        setCompanyInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const filteredWards = wardsData.filter(ward => ward.province_id.toString() === provinceCode);
        setWards(filteredWards);
        setCompanyInfo(prevInfo => ({
            ...prevInfo,
            registeredProvince: provinceCode,
            registeredWard: ''
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyInfo(prevInfo => ({
                    ...prevInfo,
                    logo: file,
                    logoPreview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoClick = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^(0)[0-9]{9}$/;
        return phoneRegex.test(phone);
    };

    const handleSave = () => {
        const newErrors = {};

        if (!validatePhoneNumber(companyInfo.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert('Vui lòng kiểm tra lại các trường thông tin bị lỗi.');
            return;
        }

        console.log('Thông tin công ty đã được lưu:', companyInfo);
        setIsEditing(false);
        alert('Đã lưu thay đổi!');
    };

    const getProvinceName = (code) => {
        const province = provinces.find(p => p.code === code);
        return province ? province.name : '';
    };

    const getWardName = (code) => {
        const ward = wardsData.find(w => w.code === code);
        return ward ? ward.name : '';
    };

    return (
        <div className="company-management-container">
            <h3>QUẢN LÝ TRANG CÔNG TY</h3>
            {isEditing ? (
                <div className="company-edit-form">

                    <div className="logo-upload-section">
                        <label>Logo Công ty</label>
                        <div className="logo-preview-wrapper" onClick={handleLogoClick}>
                            {companyInfo.logoPreview ? (
                                <img
                                    src={companyInfo.logoPreview}
                                    alt="Logo Preview"
                                    className="logo-preview"
                                />
                            ) : (
                                <div className="logo-placeholder">
                                    <span>Tải logo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>


                    <div className="form-group">
                        <label>Tên Công ty</label>
                        <input
                            type="text"
                            name="name"
                            value={companyInfo.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tên người liên hệ</label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={companyInfo.contactPerson}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="registeredProvince">Tỉnh / Thành phố</label>
                        <select
                            id="registeredProvince"
                            name="registeredProvince"
                            value={companyInfo.registeredProvince}
                            onChange={handleProvinceChange}
                            required
                        >
                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="registeredWard">Xã / Phường</label>
                        <select
                            id="registeredWard"
                            name="registeredWard"
                            value={companyInfo.registeredWard}
                            onChange={handleInputChange}
                            required
                            disabled={!companyInfo.registeredProvince}
                        >
                            <option value="">-- Chọn Xã/Phường --</option>
                            {wards.map((ward) => (
                                <option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ chi tiết</label>
                        <input
                            type="text"
                            name="detailedAddress"
                            value={companyInfo.detailedAddress}
                            onChange={handleInputChange}
                            placeholder="Số nhà, tên đường, khu phố..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={companyInfo.phone}
                            onChange={handleInputChange}
                        />

                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                        <label>Website</label>
                        <input
                            type="url"
                            name="website"
                            value={companyInfo.website}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả công ty</label>
                        <textarea
                            name="description"
                            value={companyInfo.description}
                            onChange={handleInputChange}
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="button-group">
                        <button onClick={handleSave} className="save-button">Lưu Thay Đổi</button>
                        <button onClick={() => setIsEditing(false)} className="cancel-button">Hủy</button>
                    </div>
                </div>
            ) : (
                <div className="company-details">
                    <div className="company-logo-display">
                        {companyInfo.logoPreview ? (
                            <img src={companyInfo.logoPreview} alt="Company Logo" className="company-logo-preview" />
                        ) : (
                            <div className="logo-placeholder">
                                <span>Logo</span>
                            </div>
                        )}
                    </div>
                    <p><strong>Tên Công ty:</strong> {companyInfo.name}</p>

                    <p><strong>Tên người liên hệ:</strong> {companyInfo.contactPerson}</p>
                    <p>
                        <strong>Địa chỉ:</strong>{" "}
                        {[companyInfo.detailedAddress, getWardName(companyInfo.registeredWard), getProvinceName(companyInfo.registeredProvince)]
                            .filter(Boolean)
                            .join(", ") || "Chưa cập nhật"}
                    </p>
                    <p><strong>Điện thoại:</strong> {companyInfo.phone}</p>
                    <p><strong>Website:</strong> <a href={companyInfo.website} target="_blank" rel="noopener noreferrer">{companyInfo.website}</a></p>
                    <p><strong>Mô tả:</strong> {companyInfo.description}</p>
                    <button onClick={() => setIsEditing(true)} className="edit-button">Chỉnh sửa</button>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;