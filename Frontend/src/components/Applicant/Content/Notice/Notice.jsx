import React, { useState, useEffect } from "react";
import "./Notice.css";
import province from "../../../../../data/provinces.json";
import axios from "axios";
import Toast from '../../../Toast/Toast.jsx'
import useToast from '../../../../utils/useToast.js'

const NoticeTable = () => {
  const [noticeData, setNoticeData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const token = localStorage.getItem("token");
  const applicantID = localStorage.getItem("applicantID");

  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    salary: "",
    level: "",
    frequency: "daily",
  });

  useEffect(() => {
    if (!token || !applicantID) return;

    const fetchNotice = async () => {
      const res = await axios.get(
        "http://localhost:8080/api/applicant/notice",
        {
          params: { id: applicantID },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      setNoticeData(res.data);
    };

    fetchNotice();
  }, [token, applicantID]);

  const handleCreateNew = () => {
    setEditingNotice(null);
    setFormData({
      jobTitle: "",
      location: "",
      salary: "",
      level: "",
      frequency: "daily",
    });
    setShowPopup(true);
  };

  const handleEdit = (item) => {
    setEditingNotice(item);

    setFormData({
      jobTitle: item.title,
      location: item.location,
      salary: item.salary,
      level: item.level,
      frequency: item.frequency,
    });

    setShowPopup(true);
  };

  const confirmDelete = (id) => {
    showWarning(
      "Bạn chắc chắn muốn xoá thông báo này?",
      () => {
        handleDelete(id);
        hideToast();
      },
      () => hideToast()
    )

  };
  const handleDelete = async (id) => {
    try {
       await axios.delete(`http://localhost:8080/api/applicant/notice/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNoticeData(noticeData.filter((n) => n.id !== id));
    showSuccess("Xóa thông báo thành công");
    } catch {
      showError("Xóa thông báo thất bại")
    }

  };


  const handleSaveNotice = () => {
    const request = {
      jobTitle: formData.jobTitle,
      location: formData.location,
      salary: formData.salary,
      level: formData.level,
      frequency: formData.frequency,
    };

    if (editingNotice) {
      axios
        .put(
          `http://localhost:8080/api/applicant/notice/update/${editingNotice.id}`,
          request,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {

          const updatedList = noticeData.map((n) =>
            n.id === editingNotice.id ? res.data.jobNoticeDTO : n
          );
          setNoticeData(updatedList);
          setShowPopup(false);
        })
      showSuccess("Cập nhật thông báo thành công")
      // .catch((err) => console.error("Lỗi update:", err));
    }
    else {
      axios
        .post(
          `http://localhost:8080/api/applicant/notice/create?applicantID=${applicantID}`,
          request,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setNoticeData([...noticeData, res.data.jobNoticeDTO]);
          setShowPopup(false);
        })
      showSuccess("Tạo thông báo thành công")
      // .catch((err) => console.error("Lỗi create:", err));
    }
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
          {noticeData.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.createdDate}</td>
              <td>{item.matchingJobs}</td>
              <td>
                {item.frequency === 'daily' ? 'Mỗi ngày' :
                  item.frequency === 'weekly' ? 'Mỗi tuần' :
                    item.frequency === 'monthly' ? 'Mỗi tháng' :
                      item.frequency}
              </td>

              <td>
                <div className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => confirmDelete(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn-create" onClick={handleCreateNew}>
        Tạo Mới
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              ×
            </button>

            <h2 className="popup-title">
              {editingNotice ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
            </h2>

            <div className="popup-form">
              <div className="form-group">
                <label>Vị trí ứng tuyển</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Nơi làm việc</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="">Tất cả địa điểm</option>
                  {province.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Mức lương</label>
                <select
                  name="salary"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="">Chọn mức lương</option>
                  <option value="duoi1">Dưới 1 triệu</option>
                  <option value="2-4">2 - 4 triệu</option>
                  <option value="4-10">4 - 10 triệu</option>
                  <option value="10-20">10 - 20 triệu</option>
                  <option value="tren20">Trên 20 triệu</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cấp bậc</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="">Tất cả cấp bậc</option>
                  <option value="INTERN">INTERN</option>
                  <option value="FRESHER">FRESHER</option>
                  <option value="JUNIOR">JUNIOR</option>
                  <option value="MID_LEVEL">MID_LEVEL</option>
                  <option value="SENIOR">SENIOR</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời gian nhận email</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="daily">Mỗi ngày</option>
                  <option value="weekly">Mỗi tuần</option>
                  <option value="monthly">Mỗi tháng</option>
                </select>
              </div>

              <button className="btn-save" onClick={handleSaveNotice}>
                LƯU
              </button>
            </div>
          </div>
        </div>
      )}
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
};

export default NoticeTable;
