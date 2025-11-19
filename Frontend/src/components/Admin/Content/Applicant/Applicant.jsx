// src/components/Applicant/Applicant.jsx
import './Applicant.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Applicant({ onViewDetail }) {

  const [applicants, setApplicants] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {

    axios.get('http://localhost:8080/api/admin/applicant', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setApplicants(res.data))
      .catch(err => console.error(err));
  }, []);

  const deleteApplicant = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/admin/applicant/delete`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id }
      });
      alert(res.data);

      // update trạng thái trong state
      setApplicants(prev => prev.map(a =>
        a.applicantID === id ? { ...a, active: 'Bị khóa' } : a
      ));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

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
                <td>{applicant.gender}</td>
                <td>{applicant.phone}</td>
                {/* <td><span className="status-badge active">{applicant.active}</span></td> */}
                <td>
                  <span className={`status-badge ${applicant.active ? 'Hoạt động' : 'Bị khóa'}`}>
                    {applicant.active}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="btn-view"
                      onClick={() => onViewDetail(applicant)}
                    >
                      Xem
                    </button>
                    {applicant.active !== 'Bị khoá' && (
                      <button className="btn-delete" onClick={() => deleteApplicant(applicant.applicantID)}>Xóa</button>)}
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