import { useState } from 'react';
import axios from 'axios';
import './WriteReview.css';   // file style tuỳ chỉnh (tạm dùng inline cũng được)

function WriteReview({ employerId, onSuccess }) {
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const applicantID = localStorage.getItem('applicantID')

  const submit = async () => {
    
    if (!score || !content.trim()) return alert('Vui lòng chọn sao và nhập nội dung!');
    setLoading(true);
    try {
      await axios.post(
         `http://localhost:8080/api/applicant/companies/review?applicantId=${applicantID}`,
        { employerId, score, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Gửi đánh giá thành công!');
      setScore(0);
      setContent('');
      onSuccess?.();               
    } catch (e) {
      alert('Gửi thất bại: ' + (e.response?.data || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="write-review-mini">
      <h4>Viết đánh giá</h4>

      {/* Chọn sao */}
      <div className="stars-wrapper">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`star ${s <= score ? 'filled' : ''}`}
            onClick={() => setScore(s)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Nhập nội dung */}
      <textarea
        className="review-textarea"
        rows={4}
        placeholder="Nhập nội dung đánh giá..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="btn-submit" onClick={submit} disabled={loading}>
        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </div>
  );
}
export default WriteReview