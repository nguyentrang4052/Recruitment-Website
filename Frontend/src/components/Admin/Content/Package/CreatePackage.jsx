import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default function CreatePackage({ onCreate, onCancel }) {
  const [form, setForm] = useState({
    packageName: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    features: '',
    taxRate: '',
    isRecommended: false,
  });
  const [err, setErr] = useState({});

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (err[name]) setErr((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.packageName.trim()) e.packageName = 'Vui lòng nhập tên gói';
    if (!form.category.trim()) e.category = 'Vui lòng nhập danh mục';
    if (!/^[0-9,]+$/.test(form.price)) e.price = 'Giá không hợp lệ (VD: 1,500,000)';
    if (!form.duration || Number(form.duration) < 1) e.duration = 'Thời hạn ≥ 1 ngày';
    if (!form.taxRate || Number(form.taxRate) < 0) e.taxRate = 'Thuế không hợp lệ';
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dto = {
      ...form,
      price: Number(form.price.replace(/,/g, '')),
      taxRate: Number(form.taxRate),
      features: form.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    onCreate(dto);
  };

  return (
    <div className="add-edit-container">
      <div className="add-edit-form">
        <div className="form-header">
          <h2 className="form-title">Tạo gói dịch vụ mới</h2>
          <p className="form-subtitle">Điền thông tin chi tiết cho gói dịch vụ mới</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Tên gói <span className="required">*</span>
              </label>
              <input
                name="packageName"
                value={form.packageName}
                onChange={handle}
                className={`form-input ${err.packageName ? 'error' : ''}`}
                placeholder="VD: Gói VIP"
              />
              {err.packageName && <span className="error-message">{err.packageName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Danh mục <span className="required">*</span>
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handle}
                className={`form-input ${err.category ? 'error' : ''}`}
                placeholder="VD: Premium"
              />
              {err.category && <span className="error-message">{err.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Giá (VNĐ) <span className="required">*</span>
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handle}
                className={`form-input ${err.price ? 'error' : ''}`}
                placeholder="1,500,000"
              />
              {err.price && <span className="error-message">{err.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Thời hạn (ngày) <span className="required">*</span>
              </label>
              <input
                name="duration"
                type="number"
                min="1"
                value={form.duration}
                onChange={handle}
                className={`form-input ${err.duration ? 'error' : ''}`}
                placeholder="30"
              />
              {err.duration && <span className="error-message">{err.duration}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Thuế (%) <span className="required">*</span>
              </label>
              <input
                name="taxRate"
                type="number"
                step="0.01"
                value={form.taxRate}
                onChange={handle}
                className={`form-input ${err.taxRate ? 'error' : ''}`}
                placeholder="10"
              />
              {err.taxRate && <span className="error-message">{err.taxRate}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isRecommended"
                  checked={form.isRecommended}
                  onChange={handle}
                />
                Gói đề xuất
              </label>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={3}
              className="form-input"
              placeholder="Mô tả ngắn gọn về gói dịch vụ..."
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Tính năng (mỗi dòng 1 tính năng)</label>
            <textarea
              name="features"
              value={form.features}
              onChange={handle}
              rows={4}
              className="form-input"
              placeholder="20 tin tuyển dụng&#10;Hiển thị 60 ngày&#10;Hỗ trợ 24/7"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary-package">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tạo gói mới
            </button>
            <button type="button" className="btn-secondary-package" onClick={onCancel}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}