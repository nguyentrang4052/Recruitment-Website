import { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePackage from './CreatePackage';
import EditPackage from './EditPackage';
import './Package.css';

const api = axios.create({
  baseURL: 'http://localhost:8080',
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

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/packages');
      setList(data);
    } catch {
      alert('❌ Không thể tải danh sách gói');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = async (dto) => {
    try {
      const { data } = await api.post('/api/admin/packages', dto);
      setList([...list, data.data]);
      setIsAdding(false);
      alert('✅ Tạo gói thành công!');
    } catch (e) {
      alert('❌ ' + (e.response?.data?.message || 'Tạo thất bại'));
    }
  };

  const handleEdit = async (dto) => {
    try {
      const { data } = await api.put(`/api/admin/packages/${dto.packageID}`, dto);
      setList(list.map((p) => (p.packageID === dto.packageID ? data.data : p)));
      setIsEditing(false);
      alert('✅ Cập nhật thành công!');
    } catch (e) {
      alert('❌ ' + (e.response?.data?.message || 'Sửa thất bại'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa gói này?')) return;
    try {
      await api.delete(`/api/admin/packages/${id}`);
      setList(list.filter((p) => p.packageID !== id));
      alert('✅ Xóa thành công!');
    } catch (e) {
      alert('❌ ' + (e.response?.data?.message || 'Xóa thất bại'));
    }
  };

  if (loading) return <div className="loading-spinner">⏳ Đang tải...</div>;

  return (
    <div>
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

        {isAdding && <CreatePackage onCreate={handleCreate} onCancel={() => setIsAdding(false)} />}
        {isEditing && (
          <EditPackage
            data={selected}
            onEdit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {!isAdding && !isEditing && (
          <div className="package-grid">
            {list.map((p) => (
              <div key={p.packageID} className="package-card">
                <h3 className="package-name">{p.packageName}</h3>
                <div className="package-price">{p.price.toLocaleString('vi-VN')}đ</div>
                <ul className="package-features">
                  {(p.features || []).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                <div className="package-actions">
                  <button
                    className="btn-outline blue full"
                    onClick={() => {
                      setSelected(p);
                      setIsEditing(true);
                    }}
                  >
                    Chỉnh sửa
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
  );
}