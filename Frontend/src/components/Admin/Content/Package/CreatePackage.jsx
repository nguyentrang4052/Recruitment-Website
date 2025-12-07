import { useState, useEffect } from 'react';
import useToast from '../../../../utils/useToast.js';   // <- thêm
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default function CreatePackage({ onCreate, onCancel, serverErrors }) {
  const { showError } = useToast();                     // <- lấy hàm showError

  const [form, setForm] = useState({
    packageName: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    taxRate: '',
    isRecommended: false,
    isHidden: false,
    maxPosts: '',
    maxCvViews: '',
    supportPriorityDays: '',
    has1on1Consult: false,
    hasEmailSupport: false,
  });

  const [err, setErr] = useState({});                   // chỉ dùng cho client-side

  /* Hiển thị lỗi server bằng Toast */
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length) {
      // show lỗi đầu tiên
      const msg = Object.values(serverErrors)[0];
      showError(Array.isArray(msg) ? msg[0] : msg);
    }
  }, [serverErrors, showError]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (err[name]) setErr((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.packageName.trim()) e.packageName = 'Vui lòng nhập tên gói';
    if (!form.category.trim()) e.category = 'Vui lòng chọn danh mục';
    if (form.price === '' || Number(form.price) < 0) e.price = 'Giá phải ≥ 0';
    if (!form.duration || Number(form.duration) < 1) e.duration = 'Thời hạn ≥ 1 ngày';
    if (form.taxRate && Number(form.taxRate) < 0) e.taxRate = 'Thuế không được âm';
    if (form.maxPosts && Number(form.maxPosts) < 0) e.maxPosts = 'Số bài viết không được âm';
    if (form.maxCvViews && Number(form.maxCvViews) < 0) e.maxCvViews = 'Lượt xem CV không được âm';
    if (form.supportPriorityDays && Number(form.supportPriorityDays) < 0)
      e.supportPriorityDays = 'Ngày hỗ trợ không được âm';

    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dto = {
      packageName: form.packageName.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      description: form.description.trim(),
      taxRate: Number(form.taxRate) || 0,
      isRecommended: form.isRecommended,
      isHidden: form.isHidden,
      maxPosts: form.maxPosts ? Number(form.maxPosts) : null,
      maxCvViews: form.maxCvViews ? Number(form.maxCvViews) : null,
      supportPriorityDays: form.supportPriorityDays ? Number(form.supportPriorityDays) : null,
      has1on1Consult: form.has1on1Consult,
      hasEmailSupport: form.hasEmailSupport,
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
          {/* ===== Thông tin cơ bản ===== */}
          <div className="form-section-title">📋 Thông tin cơ bản</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tên gói <span className="required">*</span></label>
              <input
                name="packageName"
                value={form.packageName}
                onChange={handle}
                className={`form-input ${err.packageName || serverErrors?.packageName ? 'error' : ''}`}
                placeholder="VD: Gói Free, Gói Premium"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Danh mục <span className="required">*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handle}
                className={`form-input ${err.category || serverErrors?.category ? 'error' : ''}`}
              >
                <option value="">-- Chọn danh mục --</option>
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Giá (VNĐ) <span className="required">*</span></label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handle}
                className={`form-input ${err.price || serverErrors?.price ? 'error' : ''}`}
                placeholder="0 (miễn phí) hoặc 1500000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời hạn (ngày) <span className="required">*</span></label>
              <input
                name="duration"
                type="number"
                min="1"
                value={form.duration}
                onChange={handle}
                className={`form-input ${err.duration || serverErrors?.duration ? 'error' : ''}`}
                placeholder="30"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thuế (%)</label>
              <input
                name="taxRate"
                type="number"
                step="0.01"
                min="0"
                value={form.taxRate}
                onChange={handle}
                className={`form-input ${err.taxRate || serverErrors?.taxRate ? 'error' : ''}`}
                placeholder="10"
              />
            </div>
          </div>

          {/* ===== Giới hạn quyền ===== */}
          <div className="form-section-title">🔒 Giới hạn quyền</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Số bài viết tối đa</label>
              <input
                name="maxPosts"
                type="number"
                min="0"
                value={form.maxPosts}
                onChange={handle}
                className={`form-input ${err.maxPosts || serverErrors?.maxPosts ? 'error' : ''}`}
                placeholder="20 (để trống = không giới hạn)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lượt xem CV tối đa</label>
              <input
                name="maxCvViews"
                type="number"
                min="0"
                value={form.maxCvViews}
                onChange={handle}
                className={`form-input ${err.maxCvViews || serverErrors?.maxCvViews ? 'error' : ''}`}
                placeholder="100 (để trống = không giới hạn)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ưu tiên duyệt tin trong vòng (ngày)</label>
              <input
                name="supportPriorityDays"
                type="number"
                min="0"
                value={form.supportPriorityDays}
                onChange={handle}
                className={`form-input ${err.supportPriorityDays || serverErrors?.supportPriorityDays ? 'error' : ''}`}
                placeholder="30"
              />
            </div>
          </div>

          {/* ===== Dịch vụ bổ sung ===== */}
          <div className="form-section-title">⭐ Dịch vụ bổ sung</div>
          <div className="form-grid">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="has1on1Consult"
                  checked={form.has1on1Consult}
                  onChange={handle}
                />
                Tư vấn 1-1 (với chuyên gia)
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="hasEmailSupport"
                  checked={form.hasEmailSupport}
                  onChange={handle}
                />
                Hỗ trợ Email 24/7
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isRecommended"
                  checked={form.isRecommended}
                  onChange={handle}
                />
                Gói được đề xuất (hiển thị dấu ⭐)
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isHidden"
                  checked={form.isHidden}
                  onChange={handle}
                />
                Ẩn gói này (không hiển thị cho khách hàng)
              </label>
            </div>
          </div>

          {/* ===== Mô tả ===== */}
          <div className="form-section-title">📝 Mô tả</div>
          <div className="form-group full-width">
            <label className="form-label">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={4}
              className="form-input"
              placeholder="Mô tả ngắn gọn về gói dịch vụ..."
            />
          </div>

          {/* ===== Hành động ===== */}
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