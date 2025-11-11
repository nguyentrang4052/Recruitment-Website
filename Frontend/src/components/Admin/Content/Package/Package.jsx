// src/components/Packages.jsx
import { useState } from 'react';
import CreatePackage from './CreatePackage';
import EditPackage from './EditPackage';
import './Package.css';

export default function Packages() {
  const [list, setList] = useState([
    { name: 'Gói Cơ bản', price: '500,000', posts: '5', duration: '30' },
    { name: 'Gói Tiêu chuẩn', price: '1,500,000', posts: '20', duration: '60' },
    { name: 'Gói Premium', price: '3,000,000', posts: '50', duration: '90' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleCreate = (newPackage) => {
    setList([...list, newPackage]);
    setIsAdding(false);
  };

  const handleEdit = (updatedPackage) => {
    setList(list.map(p => p.name === updatedPackage.name ? updatedPackage : p));
    setIsEditing(false);
  };

  const handleDelete = (packageName) => {
    setList(list.filter(p => p.name !== packageName));
  };

  return (
    <div>
      <h1 className="content-title">Quản lý Gói dịch vụ</h1>
      <div className="card">
        <div className="table-toolbar">
          <button className="btn-primary-package" onClick={() => setIsAdding(true)}>Tạo gói mới</button>
        </div>

        {isAdding && <CreatePackage onCreate={handleCreate} />}
        {isEditing && <EditPackage packageToEdit={selectedPackage} onEdit={handleEdit} />}

        {!isAdding && !isEditing && (
          <div className="package-grid">
            {list.map((p, i) => (
              <div key={i} className="package-card">
                <h3 className="package-name">{p.name}</h3>
                <div className="package-price">{p.price}đ</div>
                <ul className="package-features">
                  <li>{p.posts} tin tuyển dụng</li>
                  <li>Hiển thị {p.duration} ngày</li>
                  <li>Hỗ trợ 24/7</li>
                </ul>
                <div className="package-actions">
                  <button 
                    className="btn-outline blue full" 
                    onClick={() => { setIsEditing(true); setSelectedPackage(p); }}>Chỉnh sửa</button>
                  <button 
                    className="btn-outline red full" 
                    onClick={() => handleDelete(p.name)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
