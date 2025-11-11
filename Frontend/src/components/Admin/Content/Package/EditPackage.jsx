// src/components/EditPackage.jsx
import { useState, useEffect } from 'react';

export default function EditPackage({ packageToEdit, onEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    posts: '',
    duration: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (packageToEdit) {
      setFormData({
        name: packageToEdit.name || '',
        price: packageToEdit.price || '',
        posts: packageToEdit.posts || '',
        duration: packageToEdit.duration || '',
        description: packageToEdit.description || ''
      });
    }
  }, [packageToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên gói dịch vụ';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Vui lòng nhập giá gói';
    } else if (isNaN(formData.price.replace(/,/g, ''))) {
      newErrors.price = 'Giá phải là số';
    }

    if (!formData.posts.trim()) {
      newErrors.posts = 'Vui lòng nhập số tin tuyển dụng';
    } else if (isNaN(formData.posts) || parseInt(formData.posts) < 1) {
      newErrors.posts = 'Số tin phải là số nguyên dương';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Vui lòng nhập thời hạn hiển thị';
    } else if (isNaN(formData.duration) || parseInt(formData.duration) < 1) {
      newErrors.duration = 'Thời hạn phải là số nguyên dương';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onEdit({
        name: formData.name,
        price: formData.price,
        posts: formData.posts,
        duration: formData.duration,
        description: formData.description
      });
    }
  };

  return (
    <div className="add-edit-container">
      <div className="add-edit-form">
        <div className="form-header">
          <h2 className="form-title">Chỉnh Sửa Gói Dịch Vụ</h2>
          <p className="form-subtitle">Cập nhật thông tin cho gói "{packageToEdit?.name}"</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Tên gói dịch vụ <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Gói Premium"
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Giá gói (VNĐ) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="VD: 1,500,000"
                className={`form-input ${errors.price ? 'error' : ''}`}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="posts" className="form-label">
                Số tin tuyển dụng <span className="required">*</span>
              </label>
              <input
                type="number"
                id="posts"
                name="posts"
                value={formData.posts}
                onChange={handleChange}
                placeholder="VD: 20"
                min="1"
                className={`form-input ${errors.posts ? 'error' : ''}`}
              />
              {errors.posts && <span className="error-message">{errors.posts}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration" className="form-label">
                Thời hạn (ngày) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="VD: 60"
                min="1"
                className={`form-input ${errors.duration ? 'error' : ''}`}
              />
              {errors.duration && <span className="error-message">{errors.duration}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">
              Mô tả gói dịch vụ
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về gói dịch vụ..."
              rows="4"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary-package">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cập nhật
            </button>
            <button
              type="button"
              className="btn-secondary-package"
              onClick={() => window.location.reload()}
            >
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}