// src/components/Employer/Employers.jsx
import './Employer.css';

export default function Employers({ onViewDetail }) {
  const employers = [
    {
      employerID: 1,
      employerName: 'Công ty ABC Tech',
      fullName: 'Nguyễn Văn A',
      representative: 'Nguyễn Văn A',
      phone: '0123456789',
      companyWebsite: 'https://abctech.vn',
      companyProfile: 'Công ty chuyên về phần mềm và giải pháp công nghệ.',
      address: 'Hà Nội',
      companyLogo: null,
      companyImage: null,
      account: {
        avatar: 'https://i.pravatar.cc/150?u=1'
      },
    },
    {
      employerID: 2,
      employerName: 'XYZ Solutions',
      fullName: 'Trần Thị B',
      representative: 'Trần Thị B',
      phone: '0987654321',
      companyWebsite: 'https://xyz.vn',
      companyProfile: 'Chuyên outsourcing và product tech.',
      address: 'TP.HCM',
      companyLogo: null,
      companyImage: null,
      account: {
        avatar: 'https://i.pravatar.cc/150?u=2'
      },
    }
  ];

  return (
    <div className="employers-wrapper">
      <h1 className="content-title">Quản lý Nhà tuyển dụng</h1>
      <div className="card">
        <div className="table-toolbar">
          <input type="text" placeholder="Tìm kiếm nhà tuyển dụng..." className="table-search" />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên công ty</th>
              <th>Người đại diện</th>
              <th>Số điện thoại</th>
              <th>Website công ty</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((emp) => (
              <tr key={emp.employerID}>
                <td>{emp.employerID}</td>
                <td>{emp.employerName}</td>
                <td>{emp.representative}</td>
                <td>{emp.phone}</td>
                <td><a href={emp.companyWebsite} target="_blank" rel="noopener noreferrer">{emp.companyWebsite}</a></td>
                <td><span className="status-badge active">Hoạt động</span></td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-view"
                      onClick={() => onViewDetail(emp)}
                    >
                      Xem
                    </button>
                    <button className="btn-delete">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
