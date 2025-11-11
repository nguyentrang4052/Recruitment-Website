// src/components/Reports.jsx
import './Report.css'
export default function Reports() {
  const list = [
    { type: 'Tin tuyển dụng giả',         status: 'Chờ xử lý',  reporter: 'Nguyễn A', statusClass: 'pending' },
    { type: 'Lừa đảo',                    status: 'Đang xử lý', reporter: 'Trần B',   statusClass: 'pending' },
    { type: 'Nội dung không phù hợp',     status: 'Đã xử lý',   reporter: 'Lê C',     statusClass: 'active' },
  ];
  return (
    <div>
      <h1 className="content-title">Quản lý Báo cáo Vi phạm</h1>
      <div className="card">
        <div className="filter-toolbar">
          <select className="filter-select">
            <option>Tất cả trạng thái</option>
            <option>Chờ xử lý</option>
            <option>Đang xử lý</option>
            <option>Đã xử lý</option>
          </select>
          <input type="text" placeholder="Tìm kiếm báo cáo..." className="filter-search" />
        </div>

        <div className="report-list">
          {list.map((r,i)=>(
            <div key={i} className="report-card">
              <div className="report-card-content">
                <div className="report-info">
                  <div className="report-header">
                    <h3 className="report-title">{r.type}</h3>
                    <span className={`status-badge ${r.statusClass}`}>{r.status}</span>
                  </div>
                  <p className="report-reporter">Người báo cáo: {r.reporter}</p>
                  <p className="report-date">Ngày báo cáo: 10/11/2025</p>
                </div>
                <div className="report-actions">
                  <button className="btn-outline blue">Xem chi tiết</button>
                  <button className="btn-success">Xử lý</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}