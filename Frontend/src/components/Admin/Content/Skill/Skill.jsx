// src/components/Skills.jsx
import './Skill.css';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useEffect } from 'react';
import axios from 'axios';
import useToast from '../../../../utils/useToast'
import Toast from '../../../Toast/Toast';
const API_URL = import.meta.env.VITE_API_URL;

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/skill`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSkills(res.data))
  }, []);


  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const confirmDelete = (id) => {
    showWarning(
      "Bạn chắc chắn muốn xoá kỹ năng này?",
      () => {
        handleDeleteSkill(id);
        hideToast();
      },
      () => hideToast()
    )

  };

  const handleDeleteSkill = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/skill/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showSuccess(res.data);
      setSkills(prevSkills => prevSkills.filter(skill => skill.skillID !== id));
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data);
      } else {
        showError("Xoá kỹ năng thất bại");
      }
    }
  };


  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      showError("Tên kỹ năng không được để trống!");
      return;
    }


    try {
      const res = await axios.post(
        `${API_URL}/api/admin/skill/create`,
        { skillName: newSkill.name, description: newSkill.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Thêm kỹ năng thành công");
      setSkills([...skills, res.data]);
      setNewSkill({ name: '', description: '' });
      setIsAdding(false);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data);
      } else {
        showError("Thêm kỹ năng thất bại");
      }
    }

  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      const res = await axios.get(`${API_URL}/api/admin/skill/search`, {
        params: { skillName: searchTerm },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(res.data);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <div>
      <h1 className="content-title">Quản lý Danh mục Kỹ năng</h1>
      <div className="card">
        <div className="table-toolbar">
          {/* <input type="text" placeholder="Tìm kiếm kỹ năng..." className="table-search" /> */}
          <input
            type="text"
            placeholder="Tìm kiếm kỹ năng..."
            className="table-search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
          />
          <button className="btn-primary-employer" onClick={() => setIsAdding(true)}>Thêm kỹ năng mới</button>
        </div>

        {isAdding && (
          <div className="add-skill-form">
            <h2>Thêm Kỹ Năng Mới</h2>
            <input
              type="text"
              placeholder="Tên kỹ năng"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <textarea
              placeholder="Mô tả kỹ năng"
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            />
            <button className="btn-primary-employer" onClick={handleAddSkill}>Lưu</button>
            <button className="btn-secondary" onClick={() => setIsAdding(false)}>Hủy</button>
          </div>
        )}

        <div className="skills-grid">
          {skills.map((s, i) => (
            <div key={i} className="skill-card">
              <div className="skill-card-content">
                <div className="skill-info">
                  <h3>{s.skillName}</h3>
                  <p>{s.description}</p>
                </div>
                <div className="skill-actions">
                  <button
                    className="icon-button red"
                    onClick={() => confirmDelete(s.skillID)}
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
          confirmText={toast.confirmText}
          cancelText={toast.cancelText}
        />
      )}
    </div>
  );
}
