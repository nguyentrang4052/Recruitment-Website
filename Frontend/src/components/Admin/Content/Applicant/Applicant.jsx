import './Applicant.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useToast from '../../../../utils/useToast'
import Toast from '../../../Toast/Toast';

const API_URL = import.meta.env.VITE_API_URL;
export default function Applicant({ onViewDetail }) {

  const [applicants, setApplicants] = useState([]);
  const token = localStorage.getItem("token");

  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const fetchApplicants = async () => {
    const res = await axios.get(`${API_URL}/api/admin/applicant`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setApplicants(res.data);
  }
  useEffect(() => {
    fetchApplicants();
  }, []);

  const confirmDelete = (id) => {
    showWarning(
      "Bạn chắc chắn muốn khoá tài khoản này?",
      () => {
        deleteApplicant(id);
        hideToast();
      },
      () => hideToast()
    )

  };

  const deleteApplicant = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/api/admin/applicant/delete`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id }
      });
      showSuccess(res.data);
      await fetchApplicants();
    } catch {
      showError("Khoá tài khoản thất bại");
    }
  };

  return (
    <div className="applicant-wrapper">
      <h1 className="content-title">Quản lý Ứng viên</h1>
      <div className="card">

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
                      <button className="btn-delete" onClick={() => confirmDelete(applicant.applicantID)}>Khoá</button>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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