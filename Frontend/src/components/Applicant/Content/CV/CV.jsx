import React, { useState } from 'react';
// import axios from 'axios';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import './CV.css';
const categories = ['Tất cả', 'Đơn giản', 'Hiện đại', 'Chuyên nghiệp'];


const NavTabs = ({ active, setActive }) => (
  <div className="nav-tabs">
    {categories.map(cat => (
      <button
        key={cat}
        className={active === cat ? 'active' : ''}
        onClick={() => setActive(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

const SIMPLES = [
  { id: 'DAG3VL7oQY8', name: 'Đơn giản 1', image: '/images/simple/simple1.jpg' },
  { id: 'DAG3U22M4vU', name: 'Đơn giản 2', image: '/images/simple/simple2.jpg' },
  { id: 'DAG3VETZvKk', name: 'Đơn giản 3', image: '/images/simple/simple3.jpg' },
];

const MODERNS = [
  { id: 'DAG3V3vYIQc', name: 'Hiện đại 1', image: '/images/modern/modern1.jpg' },
  { id: 'DAG3jxg5ZH0', name: 'Hiện đại 2', image: '/images/modern/modern2.jpg' },
  { id: 'DAG3j9XA2nA', name: 'Hiện đại 3', image: '/images/modern/modern3.jpg' },
]

const PROFESSIONALS = [
  { id: 'DAG3j7Mwpws', name: 'Chuyên nghiệp 4', image: '/images/pro/pro1.jpg' },
  { id: 'DAG3j2rkd8U', name: 'Chuyên nghiệp 5', image: '/images/pro/pro2.jpg' },
  { id: 'DAG3VMuJB3U', name: 'Chuyên nghiệp 6', image: '/images/pro/pro3.jpg' },
];

const TEMPLATE_MAP = {
  'Tất cả': [...SIMPLES, ...MODERNS, ...PROFESSIONALS],
  'Đơn giản': SIMPLES,
  'Hiện đại': MODERNS,
  'Chuyên nghiệp': PROFESSIONALS,
};

const CvTemplates = () => {

  const [activeTab, setActiveTab] = useState('Tất cả');

  const handleUse = (tpl) => {
    window.open(`https://www.canva.com/design/${tpl.id}/edit`, '_blank');
  };

  return (
    <>
      <div className="cv-templates">
        <h1>Mẫu CV xin việc</h1>
        <p>Chọn 1 mẫu bên dưới, nhấn “Dùng mẫu này” → Canva sẽ mở ra. Sau khi chỉnh sửa xong, tải PDF về và upload ở cuối trang.</p>
        <NavTabs active={activeTab} setActive={setActiveTab} />


        {TEMPLATE_MAP[activeTab] && (
          <div className="cv-section">
            <p><MdOutlineKeyboardDoubleArrowRight />{activeTab.toUpperCase()}</p>
            <div className="template-grid">
              {TEMPLATE_MAP[activeTab].map((t) => (
                <div className="template-card" key={t.id}>
                  <img src={t.image} alt={t.name} />
                  <h3>{t.name}</h3>
                  <button className="use-btn" onClick={() => handleUse(t)}>
                    Dùng mẫu này
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default CvTemplates;