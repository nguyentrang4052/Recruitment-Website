import React, { useState } from 'react';
import './Notice.css';
import province from '../../../../../data/provinces.json'

const NoticeTable = () => {
  const [notice, setNotice] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: '',
    location: '',
    salary: '',
    level: '',
    frequency: 'daily'
  });

  const handleCreateNew = () => {
    setEditingIndex(null);
    setFormData({
      jobTitle: '',
      industry: '',
      location: '',
      salary: '',
      level: '',
      frequency: 'daily'
    });
    setShowPopup(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const notification = notice[index];
    setFormData({
      jobTitle: notification.jobTitle || '',
      industry: notification.industry || '',
      location: notification.location || '',
      salary: notification.salary || '',
      level: notification.level || '',
      frequency: notification.frequency || 'daily'
    });
    setShowPopup(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      const updatedNotice = notice.filter((_, i) => i !== index);
      setNotice(updatedNotice);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingIndex(null);
    setFormData({
      jobTitle: '',
      industry: '',
      location: '',
      salary: '',
      level: '',
      frequency: 'daily'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveNotice = () => {
    const noticeData = {
      name: `${formData.jobTitle} - ${formData.industry}`,
      createdDate: editingIndex !== null ? notice[editingIndex].createdDate : new Date().toLocaleDateString('vi-VN'),
      matchingJobs: editingIndex !== null ? notice[editingIndex].matchingJobs : 0,
      emailNotice: editingIndex !== null ? notice[editingIndex].emailNotice : true,
      jobTitle: formData.jobTitle,
      industry: formData.industry,
      location: formData.location,
      salary: formData.salary,
      level: formData.level,
      frequency: formData.frequency
    };

    if (editingIndex !== null) {
      const updatedNotice = [...notice];
      updatedNotice[editingIndex] = noticeData;
      setNotice(updatedNotice);
    } else {
      setNotice([...notice, noticeData]);
    }

    setShowPopup(false);
    setEditingIndex(null);
    setFormData({
      jobTitle: '',
      industry: '',
      location: '',
      salary: '',
      level: '',
      frequency: 'daily'
    });
  };

  return (
    <div className="notice-container">
      <h2 className="notice-title">QUẢN LÝ THÔNG BÁO VIỆC LÀM</h2>
      <table className="notice-table">
        <thead>
          <tr>
            <th>Tên Thông Báo</th>
            <th>Ngày Tạo</th>
            <th>Công Việc Phù Hợp</th>
            <th>Nhận Email</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {notice.map((notification, index) => (
            <tr key={index}>
              <td>{notification.name}</td>
              <td>{notification.createdDate}</td>
              <td>{notification.matchingJobs}</td>
              <td>
                <input
                  type="checkbox"
                  checked={notification.emailNotice}
                  onChange={() => {
                    const updatedNotice = [...notice];
                    updatedNotice[index].emailNotice = !updatedNotice[index].emailNotice;
                    setNotice(updatedNotice);
                  }}
                />
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(index)}>
                    Sửa
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(index)}>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-create" onClick={handleCreateNew}>Tạo Mới</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="popup-close" onClick={handleClosePopup}>×</button>

            <h2 className="popup-title">
              {editingIndex !== null ? 'Chỉnh sửa thông báo việc làm' : 'Tạo / chỉnh sửa thông báo việc làm'}
            </h2>
            <p className="popup-subtitle">
              Mỗi tuần bạn sẽ nhận được email những việc làm mới nhất từ nhà tuyển dụng theo tiêu chí bên dưới
            </p>

            <div className="popup-form">
              <div className="form-group">
                <label>Chức danh, vị trí công việc</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Ngành nghề</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Tất cả ngành nghề</option>
                  <option value="cntt">Công nghệ thông tin</option>
                  <option value="marketing">Marketing</option>
                  <option value="kinhdoanh">Kinh doanh</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nơi làm việc</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Tất cả địa điểm</option>
                   {province.map((province) => (
      <option key={province.id} value={province.name}>
        {province.name}
      </option>
    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Mức lương</label>
                <select
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Chọn mức lương</option>
                  <option value="duoi10">Dưới 10 triệu</option>
                  <option value="10-20">10-20 triệu</option>
                  <option value="tren20">Trên 20 triệu</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cấp bậc</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Tất cả cấp bậc</option>
                  <option value="nhanvien">Nhân viên</option>
                  <option value="truongphong">Trưởng phòng</option>
                  <option value="giamdoc">Giám đốc</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời gian nhận email</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="daily">Mỗi ngày</option>
                  <option value="weekly">Mỗi tuần</option>
                  <option value="monthly">Mỗi tháng</option>
                </select>
              </div>
            </div>

            <button className="btn-save" onClick={handleSaveNotice}>
              LƯU
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeTable;