import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Package.css';
import CreatePackage from './CreatePackage';
import EditPackage from './EditPackage';
import useToast from '../../../../utils/useToast.js';
import Toast from '../../../Toast/Toast.jsx';

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

export default function Packages() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [createError, setCreateError] = useState({});
  const [editError, setEditError] = useState({});

  const { toast, hideToast, showSuccess, showError } = useToast();

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/packages');
      console.log('📦 Data received:', data);
      setList(data);
    } catch (error) {
      console.error('Error:', error);
      showError('Không thể tải danh sách gói');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleCreate = async (dto) => {
    try {
      const { data } = await api.post('/api/admin/packages', dto);
      setList([...list, data.data || data]);
      setCreateError({});
      setIsAdding(false);
      showSuccess('Tạo gói thành công!');
    } catch (e) {

      if (e.response?.data?.errors) {
        setCreateError(e.response.data.errors);
      } else {
        showError(e.response?.data?.message || 'Tạo thất bại');
      }
    }
  };

  const handleEdit = async (dto) => {
    try {
      const { data } = await api.put(`/api/admin/packages/${dto.packageID}`, dto);
      setList(list.map((p) => (p.packageID === dto.packageID ? (data.data || data) : p)));
      setEditError({});
      setIsEditing(false);
      showSuccess('Cập nhật thành công!');
    } catch (e) {
      if (e.response?.data?.errors) {
        setEditError(e.response.data.errors);
      } else {
        showError(e.response?.data?.message || 'Sửa thất bại');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa gói này?')) return;
    try {
      await api.delete(`/api/admin/packages/${id}`);
      setList(list.filter((p) => p.packageID !== id));
      showSuccess('Xóa thành công!');
    } catch (e) {
      showError(e.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleToggleHidden = async (id, currentHidden) => {
    try {
      const { data } = await api.patch(`/api/admin/packages/${id}/toggle-hidden`, {
        isHidden: !currentHidden,
      });
      setList(list.map((p) => (p.packageID === id ? (data.data || data) : p)));
      showSuccess('Cập nhật trạng thái thành công!');
    } catch (e) {
      showError(e.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  if (loading) return <div className="loading-spinner">⏳ Đang tải...</div>;

  return (
    <>
      <div className="packages-wrapper">
        <h1 className="content-title">Quản lý Gói dịch vụ</h1>
        <div className="card">
          <div className="table-toolbar">
            <button className="btn-primary-package" onClick={() => setIsAdding(true)}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo gói mới
            </button>
          </div>

          {isAdding && (
            <CreatePackage
              onCreate={handleCreate}
              onCancel={() => setIsAdding(false)}
              serverErrors={createError}
            />
          )}
          {isEditing && (
            <EditPackage
              data={selected}
              onEdit={handleEdit}
              onCancel={() => setIsEditing(false)}
              serverErrors={editError}
            />
          )}

          {!isAdding && !isEditing && (
            <div className="package-grid">
              {list.map((p) => (
                <div key={p.packageID} className="package-card" data-hidden={p.isHidden}>
                  <div className="package-badge">
                    {p.isRecommended && <span className="badge recommended">🌟 Đề xuất</span>}
                    {p.isHidden && <span className="badge hidden">👁️ Ẩn</span>}
                  </div>

                  <h3 className="package-name">{p.packageName}</h3>
                  <div className="package-category">{p.category}</div>
                  <div className="package-price">
                    {parseFloat(p.price) === 0
                      ? 'Miễn phí'
                      : `${parseFloat(p.price).toLocaleString('vi-VN')}đ`}
                  </div>

                  <div className="package-specs">
                    <div className="spec">
                      <span className="spec-label">📅 Thời hạn:</span>
                      <span className="spec-value">{p.duration} ngày</span>
                    </div>
                    <div className="spec">
                      <span className="spec-label">💼 Bài viết:</span>
                      <span className="spec-value">
                        {p.maxPosts != null ? p.maxPosts : 'Không giới hạn'}
                      </span>
                    </div>
                    <div className="spec">
                      <span className="spec-label">👁️ Lượt xem CV:</span>
                      <span className="spec-value">
                        {p.maxCvViews != null ? p.maxCvViews : 'Không giới hạn'}
                      </span>
                    </div>
                    <div className="spec">
                      <span className="spec-label">🎯 Ưu tiên duyệt tin trong vòng:</span>
                      <span className="spec-value">
                        {p.supportPriorityDays ?? 0} ngày
                      </span>
                    </div>
                  </div>

                  {(p.has1on1Consult || p.hasEmailSupport || p.taxRate) && (
                    <div className="package-perks">
                      {p.has1on1Consult && <span className="perk">💬 Tư vấn 1-1</span>}
                      {p.hasEmailSupport && <span className="perk">📧 Hỗ trợ Email</span>}
                      {p.taxRate && <span className="perk">🏷️ Thuế: {parseFloat(p.taxRate)}%</span>}
                    </div>
                  )}

                  <div className="package-actions">
                    <button
                      className="btn-outline blue"
                      onClick={() => {
                        setSelected(p);
                        setIsEditing(true);
                      }}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className={`btn-outline ${p.isHidden ? 'green' : 'yellow'}`}
                      onClick={() => handleToggleHidden(p.packageID, p.isHidden)}
                    >
                      {p.isHidden ? '👁️ Hiển thị' : '🚫 Ẩn'}
                    </button>
                    <button
                      className="btn-outline red full"
                      onClick={() => handleDelete(p.packageID)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={hideToast} />}
    </>
  );
}