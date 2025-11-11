// src/components/Skills.jsx
import './Skill.css';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

export default function Skills() {
  const [skills, setSkills] = useState([
    { name: 'JavaScript', description: 'Programming Language for Web Development' },
    { name: 'React', description: 'Library for Building User Interfaces' },
    { name: 'Node.js', description: 'JavaScript Runtime for Server-Side Applications' },
    { name: 'Python', description: 'High-level Programming Language' },
    { name: 'Java', description: 'Object-Oriented Programming Language' },
    { name: 'SQL', description: 'Structured Query Language for Databases' },
    { name: 'HTML/CSS', description: 'Markup and Style for Web Pages' },
    { name: 'Git', description: 'Version Control System' },
    { name: 'Docker', description: 'Platform for Developing, Shipping, and Running Applications' },
  ]);


  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });


  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter(skill => skill.name !== skillToDelete));
  };

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.description) {
      setSkills([...skills, newSkill]);
      setNewSkill({ name: '', description: '' });
      setIsAdding(false);
    }
  };

  return (
    <div>
      <h1 className="content-title">Quản lý Danh mục Kỹ năng</h1>
      <div className="card">
        <div className="table-toolbar">
          <input type="text" placeholder="Tìm kiếm kỹ năng..." className="table-search" />
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
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                </div>
                <div className="skill-actions">
                  <button
                    className="icon-button red"
                    onClick={() => handleDeleteSkill(s.name)}
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
