import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecruitDetail.css';
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { RiMapPinFill } from "react-icons/ri";
import { CgSandClock } from "react-icons/cg";
import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { TfiMoney } from "react-icons/tfi";
import axios from 'axios';
import { formatDate } from '../../../../utils/Format'
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../../../../utils/Auth'

//Hàm làm sạch HTML trước khi render
const sanitizeHtml = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const scripts = temp.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(el => el.remove());

    const all = temp.querySelectorAll('*');
    all.forEach(el => {
        [...el.attributes].forEach(attr => {
            if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
        });
    });

    return temp.innerHTML;
};

function RecruitDetail() {
    const { rnid } = useParams();
    const token = localStorage.getItem('token');
    const [recruitmentDetail, setRecruitmentDetail] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [favoriteJobs, setFavoriteJobs] = useState([]);

    const [cvFile, setCvFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/detail", { params: { id: rnid } });
                setRecruitmentDetail(response.data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết tin tuyển dụng", error);
                setRecruitmentDetail(null);
            }
        };
        if (rnid) fetchDetail();
    }, [rnid]);

    useEffect(() => {
        const fetchRelateJob = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/applicant/relate-jobs", { params: { id: rnid } });
                setRelatedJobs(response.data);
            } catch (error) {
                console.error("Lỗi khi tải việc làm liên quan", error);
                setRelatedJobs([]);
            }
        };
        if (rnid) fetchRelateJob();
    }, [rnid]);

    const calculateRemainingDays = (deadline) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const timeDifference = deadlineDate - currentDate;
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
        if (daysRemaining < 0) return 'Đã hết hạn ứng tuyển';
        return `Còn ${daysRemaining} ngày ứng tuyển`;
    };

    const handleApplyClick = () => {
        if (token) setShowForm(true);
        else navigate('/applicant-login');
    };

    const handleApplyJob = async (e) => {
        e.preventDefault();
        if (!cvFile) {
            setMsg("Vui lòng chọn CV!");
            setMsgType("error");
            return;
        }

        const applicantId = localStorage.getItem("applicantID");
        const formData = new FormData();
        formData.append("CV", cvFile);
        formData.append("coverLetter", coverLetter);
        formData.append("RNID", rnid);
        formData.append("applicantID", applicantId);

        try {
            await axios.post("http://localhost:8080/api/applicant/apply", formData, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    "Content-Type": "multipart/form-data",
                }
            });
            alert("Ứng tuyển thành công!");
            setCoverLetter("");
            closeForm();
        } catch {
            setCoverLetter("");
            setMsg("Ứng tuyển thất bại. Vui lòng thử lại.");
            setMsgType("error");
        }
    };

    const closeForm = () => setShowForm(false);

    const viewDetail = (rnid) => navigate(`/recruitment/${rnid}`);

    const toggleFavorite = async (rnid) => {
        const applicantID = localStorage.getItem('applicantID');
        if (!token || isTokenExpired(token)) {
            navigate("/applicant-login");
            return;
        }
        try {
            await axios.post("http://localhost:8080/api/applicant/toggle", null, {
                params: { applicantID, rnid },
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavoriteJobs(prev =>
                prev.includes(rnid) ? prev.filter(id => id !== rnid) : [...prev, rnid]
            );
        } catch (err) {
            console.error("Lỗi khi lưu yêu thích:", err);
        }
    };

    useEffect(() => {
        const fetchSaveJob = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/applicant/favourite-job", {
                    params: { id: localStorage.getItem('applicantID') },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavoriteJobs(res.data.map(job => job.rnid));
            } catch {
                console.log('Lỗi khi tải tin yêu thích');
            }
        };
        if (token && localStorage.getItem('applicantID')) fetchSaveJob();
    }, [token]);

    const isFavorite = (rnid) => favoriteJobs.includes(rnid);

    const [note, setNote] = useState("");
    useEffect(() => {
        fetch("/note.txt")
            .then(res => res.text())
            .then(text => setNote(text))
            .catch(err => console.error("Lỗi đọc file:", err));
    }, []);

    const paragraphs = note.split(/\r?\n\r?\n/);

    if (!recruitmentDetail) return <div>Loading...</div>;

    return (
        <>
            <div className={`recruit-wrapper ${token ? 'logged' : 'guest'}`}>
                <div className="recruitment-detail-layout">
                    <div className="left-col">
                        <div className="recruitment-detail-container">
                            <h2 className="recruitment-position">{recruitmentDetail.position}</h2>

                            <div className="summary-info">
                                <div className="info-block">
                                    <div className="info-label">
                                        <FaMoneyBill1Wave className="info-icon" />
                                        <strong> Mức lương:</strong><br />
                                    </div>
                                    <div className="info-value">
                                        <span> {recruitmentDetail.salary}</span>
                                    </div>
                                </div>
                                <div className="info-block">
                                    <div className="info-label">
                                        <RiMapPinFill className="info-icon" />
                                        <strong> Địa điểm làm việc:</strong><br />
                                    </div>
                                    <div className="info-value">
                                        <span> {recruitmentDetail.location}</span>
                                    </div>
                                </div>
                                <div className="info-block">
                                    <div className="info-label">
                                        <CgSandClock className="info-icon" />
                                        <strong> Kinh nghiệm:</strong><br />
                                    </div>
                                    <div className="info-value">
                                        <span> {recruitmentDetail.experience}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="deadline-info">
                                <div><strong>Hạn nộp hồ sơ: </strong>{formatDate(recruitmentDetail.deadline)}</div>
                                <p className="recruitment-posted">
                                    {calculateRemainingDays(recruitmentDetail.deadline)}
                                </p>
                            </div>
                            <div className="detail-btn">
                                <button className="detail-apply-btn" onClick={handleApplyClick}>Ứng tuyển ngay</button>
                                <button
                                    className={`favorite-btn ${isFavorite(recruitmentDetail.rnid) ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(recruitmentDetail.rnid)}
                                >
                                    {isFavorite(recruitmentDetail.rnid) ? <FaHeart /> : <LuHeart />}
                                </button>
                            </div>
                        </div>

                        <div className="job-info">
                            <div className="job-description">
                                <h3>Mô tả công việc</h3>
                                <div
                                    className="formatted-content"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(recruitmentDetail.description) }}
                                />
                            </div>

                            <div className="job-benefit">
                                <h3>Quyền lợi</h3>
                                <div
                                    className="formatted-content"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(recruitmentDetail.benefit) }}
                                />
                            </div>

                            {[
                                { label: 'Thu nhập', value: recruitmentDetail.salary },
                                { label: 'Hình thức làm việc', value: recruitmentDetail.form_of_work },
                                { label: 'Cấp bậc', value: recruitmentDetail.level },
                                { label: 'Học vấn', value: recruitmentDetail.literacy },
                                { label: 'Kinh nghiệm', value: recruitmentDetail.experience },
                                { label: 'Địa điểm làm việc', value: recruitmentDetail.location },
                                { label: 'Thời gian làm việc', value: recruitmentDetail.working_time },
                                { label: 'Số lượng tuyển', value: recruitmentDetail.numbers_of_records && `${recruitmentDetail.numbers_of_records} người` },
                                { label: 'Hạn nộp hồ sơ', value: formatDate(recruitmentDetail.deadline) },
                                { label: 'Email nộp hồ sơ', value: recruitmentDetail.apply_by, isMail: true },
                            ].map(({ label, value, isMail }) =>
                                value ? (
                                    <div key={label}>
                                        <strong>{label}:</strong> {isMail ? <a href={`mailto:${value}`}>{value}</a> : value}
                                    </div>
                                ) : null
                            )}
                        </div>

                        <button className="apply-button" onClick={handleApplyClick}>Ứng tuyển ngay</button>
                    </div>

                    <div className="right-col">
                        <h3>Việc làm liên quan</h3>
                        <ul className="related-jobs">
                            {relatedJobs.map((job) => (
                                <li className="related-job-item" key={job.rnid}>
                                    <img className="related-job-logo" src={job.employer.logo} alt="" />
                                    <div className="related-job-info">
                                        <h4 className="related-job-title" onClick={() => viewDetail(job.rnid)}>
                                            {job.position}
                                        </h4>
                                        <p className="related-job-company">{job.employer.name}</p>
                                        <p className="related-job-location"><RiMapPinFill />{" " + job.location}</p>
                                        <p className="related-job-salary"><TfiMoney />{" " + job.salary}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {showForm && (
                    <div className="detail-popup-form">
                        <div className="popup-message">
                            <h3>Ứng tuyển công việc</h3>
                            {msg && (
                                <div className={`msg-line ${msgType}`}>
                                    <span>{msg}</span>
                                    <button className="msg-close" onClick={() => setMsg("")}>×</button>
                                </div>
                            )}
                            <form>
                                <div>
                                    <label>Chọn CV</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const f = e.target.files[0];
                                            if (f && f.type !== "application/pdf") {
                                                alert("Chỉ được upload file PDF");
                                                e.target.value = "";
                                                return;
                                            }
                                            setCvFile(f);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Thư giới thiệu:</label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Thư giới thiệu..."
                                    />
                                </div>
                                <div className="note-container">
                                    <h4>Lưu ý:</h4>
                                    {paragraphs.map((p, idx) => (
                                        <p key={idx}>
                                            {p.split(/\r?\n/).map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    ))}
                                </div>
                                <button type="button" className="btn-submit" onClick={handleApplyJob}>Nộp hồ sơ ứng tuyển</button>
                                <button type="button" onClick={closeForm} className="btn-close">Đóng</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RecruitDetail;