// src/components/Applicant/Applicant.jsx
import './Applicant.css';

export default function Applicant({ onViewDetail }) {
  const applicants = [
    {
      applicantID: 1,
      applicantName: 'Nguyễn Văn A',
      birthday: '2000-01-01',
      gender: 1,
      phone: '0123456789',
      address: 'Hà Nội',
      goal: 'Trở thành Senior FE',
      experience: '3 năm React',
      literacy: 'Đại học CNTT',
      skill: ['React', 'TypeScript', 'Tailwind'],
      rating: [{ score: 5, comment: 'Tốt' }]
    },
    {
      applicantID: 2,
      applicantName: 'Trần Thị B',
      birthday: '1998-05-12',
      gender: 0,
      phone: '0987654321',
      address: 'TP.HCM',
      goal: 'Làm việc remote',
      experience: '2 năm Vue',
      literacy: 'Cao đẳng',
      skill: ['Vue', 'Vite', 'Pinia'],
      rating: []
    }
  ];

  return (
    <div className="applicant-wrapper">
      <h1 className="content-title">Quản lý Ứng viên</h1>
      <div className="card">
        <div className="table-toolbar">
          <input type="text" placeholder="Tìm kiếm ứng viên..." className="table-search" />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Giới tính</th>
              <th>Điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.applicantID}>
                <td>{applicant.applicantID}</td>
                <td>{applicant.applicantName}</td>
                <td>{applicant.gender === 1 ? 'Nam' : 'Nữ'}</td>
                <td>{applicant.phone}</td>
                <td><span className="status-badge active">Hoạt động</span></td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-view"
                      onClick={() => onViewDetail(applicant)}
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