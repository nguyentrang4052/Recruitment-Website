import React, { useState, useEffect, useRef } from 'react';
import '../../Employer/CompanyManagement/CompanyManagement.css';
import provincesData from '../../../../data/provinces.json';
import wardsData from '../../../../data/wards.json';

const CompanyManagement = () => {
    const [companyInfo, setCompanyInfo] = useState({
        employerID: null,
        employerName: '',
        representative: '',
        phone: '',
        companyWebsite: '',
        companyProfile: '',
        address: '',
        logoPreview: null,
        registeredProvince: '',
        registeredWard: '',
        detailedAddress: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        setProvinces(provincesData);
    }, []);

    const loadCompanyInfo = async () => {
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (!storedUsername || !token) return;

        try {
            const res = await fetch(`http://localhost:8080/api/employer/info?username=${storedUsername}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error('HTTP error', res.status);
                return;
            }

            const data = await res.json();
            setCompanyInfo({
                employerID: data.employerID,
                employerName: data.employerName || '',
                representative: data.representative || '',
                phone: data.phone || '',
                companyWebsite: data.companyWebsite || '',
                companyProfile: data.companyProfile || '',
                address: data.address || '',
                logoPreview: data.companyLogo
                    ? data.companyLogo.startsWith('http')
                        ? data.companyLogo
                        : `http://localhost:8080${data.companyLogo}?t=${new Date().getTime()}`
                    : null,
                registeredProvince: data.registeredProvince || '',
                registeredWard: data.registeredWard || '',
                detailedAddress: data.detailedAddress || '',
            });
        } catch (err) {
            console.error('Lỗi khi load thông tin công ty:', err);
        }
    };

    useEffect(() => {
        loadCompanyInfo();
    }, []);

    useEffect(() => {
        if (!companyInfo.registeredProvince) {
            setWards([]);
            return;
        }
        const selectedProvince = provinces.find(p => p.name === companyInfo.registeredProvince);
        if (!selectedProvince) {
            setWards([]);
            return;
        }
        const filteredWards = wardsData
            .filter(w => w.province_id.toString() === selectedProvince.code)
            .map(w => w.name);
        setWards(filteredWards);
    }, [companyInfo.registeredProvince, provinces]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: '' }));
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (e) => {
        setCompanyInfo(prev => ({
            ...prev,
            registeredProvince: e.target.value,
            registeredWard: '',
        }));
    };

    const handleWardChange = (e) => {
        setCompanyInfo(prev => ({ ...prev, registeredWard: e.target.value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCompanyInfo(prev => ({
                ...prev,
                logoPreview: reader.result,
                logo: file
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleLogoClick = () => {
        if (isEditing) fileInputRef.current.click();
    };

    const validatePhoneNumber = (phone) => /^(0)[0-9]{9}$/.test(phone);

    const handleSave = async () => {
        const newErrors = {};
        if (!validatePhoneNumber(companyInfo.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';
        if (!companyInfo.employerName) newErrors.employerName = 'Tên công ty không được để trống.';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert('Vui lòng kiểm tra lại các trường thông tin.');
            return;
        }

        let logoUrl = companyInfo.logoPreview;

        if (companyInfo.logo) {
            try {
                const formData = new FormData();
                formData.append("file", companyInfo.logo);
                const uploadRes = await fetch("http://localhost:8080/api/employer/uploadLogo", {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                const uploadData = await uploadRes.json();
                logoUrl = `http://localhost:8080${uploadData.url}?t=${new Date().getTime()}`;
            } catch (err) {
                console.error('Upload logo thất bại:', err);
                alert('Upload logo thất bại!');
                return;
            }
        }

        const payload = {
            employerID: companyInfo.employerID,
            employerName: companyInfo.employerName,
            representative: companyInfo.representative,
            phone: companyInfo.phone,
            companyWebsite: companyInfo.companyWebsite,
            companyProfile: companyInfo.companyProfile,
            detailedAddress: companyInfo.detailedAddress,
            registeredProvince: companyInfo.registeredProvince,
            registeredWard: companyInfo.registeredWard,
            companyLogo: logoUrl,
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/employer/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                alert('Cập nhật thất bại. HTTP status ' + res.status);
                return;
            }
            const data = await res.json();
            if (data.message) alert(data.message);
            await loadCompanyInfo();
            setIsEditing(false);
        } catch (err) {
            console.error('Cập nhật thất bại:', err);
            alert('Cập nhật thất bại!');
        }
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
                                <img src={companyInfo.logoPreview} alt="Logo Preview" className="logo-preview" />
                            ) : (
                                <div className="logo-placeholder"><span>Tải logo</span></div>
                            )}
                            <input type="file" accept="image/*" onChange={handleLogoChange} ref={fileInputRef} style={{ display: 'none' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tên Công ty</label>
                        <input type="text" name="employerName" value={companyInfo.employerName} onChange={handleInputChange} />
                        {errors.employerName && <span className="error-message">{errors.employerName}</span>}
                    </div>

                    <div className="form-group">
                        <label>Tên người liên hệ</label>
                        <input type="text" name="representative" value={companyInfo.representative} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="registeredProvince">Tỉnh / Thành phố</label>
                        <select id="registeredProvince" value={companyInfo.registeredProvince} onChange={handleProvinceChange}>
                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                            {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="registeredWard">Xã / Phường</label>
                        <select id="registeredWard" value={companyInfo.registeredWard} onChange={handleWardChange} disabled={!companyInfo.registeredProvince}>
                            <option value="">-- Chọn Xã/Phường --</option>
                            {wards.map((w, idx) => <option key={idx} value={w}>{w}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ chi tiết</label>
                        <input type="text" name="detailedAddress" value={companyInfo.detailedAddress} onChange={handleInputChange} placeholder="Số nhà, tên đường..." />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="tel" name="phone" value={companyInfo.phone} onChange={handleInputChange} />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label>Website</label>
                        <input type="url" name="companyWebsite" value={companyInfo.companyWebsite} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Mô tả công ty</label>
                        <textarea name="companyProfile" value={companyInfo.companyProfile} onChange={handleInputChange} rows="5"></textarea>
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
                            <div className="logo-placeholder"><span>Logo</span></div>
                        )}
                    </div>
                    <p><strong>Tên Công ty:</strong> {companyInfo.employerName}</p>
                    <p><strong>Tên người liên hệ:</strong> {companyInfo.representative}</p>
                    <p><strong>Địa chỉ:</strong> {`${companyInfo.detailedAddress || ''}${companyInfo.registeredWard ? ', ' + companyInfo.registeredWard : ''}${companyInfo.registeredProvince ? ', ' + companyInfo.registeredProvince : ''}` || 'Chưa cập nhật'}</p>
                    <p><strong>Điện thoại:</strong> {companyInfo.phone}</p>
                    <p><strong>Website:</strong> <a href={companyInfo.companyWebsite} target="_blank" rel="noopener noreferrer">{companyInfo.companyWebsite}</a></p>
                    <p><strong>Mô tả:</strong> {companyInfo.companyProfile}</p>
                    <button onClick={() => setIsEditing(true)} className="edit-button">Chỉnh sửa</button>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;
