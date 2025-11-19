// src/components/Skills.jsx
import './Skill.css';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useEffect } from 'react';
import axios from 'axios';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const token = localStorage.getItem("token");
   const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  axios.get("http://localhost:8080/api/admin/skill", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setSkills(res.data))
  .catch(err => console.error(err));
}, []);


  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });


 const handleDeleteSkill = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:8080/api/admin/skill/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // setSkills(skills.filter(skill => skill.id !== id));
    alert(res.data);
     setSkills(prevSkills => prevSkills.filter(skill => skill.skillID !== id));
  } catch (err) {
   if (err.response && err.response.data) {
        alert(err.response.data); 
      } else {
        alert("Xoá kỹ năng thất bại");
      }
  }
};


  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
    alert("Tên kỹ năng không được để trống!");
    return; 
  }

  // if (!newSkill.description.trim()) {
  //   alert("Mô tả kỹ năng không được để trống!");
  //   return;
  // }
    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/skill/create",
        { skillName: newSkill.name, description: newSkill.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkills([...skills, res.data]);
      setNewSkill({ name: '', description: '' });
      setIsAdding(false);
    } catch(err) {
      if (err.response && err.response.data) {
        alert(err.response.data); 
      } else {
        alert("Thêm kỹ năng thất bại");
      }
    }
  
};

const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/skill/search', {
          params: { skillName: searchTerm }, // Gửi từ khóa tìm kiếm
          headers: { Authorization: `Bearer ${token}` }
        });
        setSkills(res.data); // Cập nhật danh sách kỹ năng với kết quả tìm kiếm
      } catch (err) {
        console.error("Tìm kiếm thất bại", err);
      }
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
                    onClick={() => handleDeleteSkill(s.skillID)}
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
