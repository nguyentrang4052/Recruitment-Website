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
import { formatDescription } from '../../../../utils/formatDescription';
import { formatRangeShort } from '../../../../utils/formatSalary';
import useToast from '../../../../utils/useToast.js'
import Toast from '../../../Toast/Toast.jsx'

function RecruitDetail() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { rnid } = useParams();
    const applicantID = localStorage.getItem('applicantID')
    const token = localStorage.getItem('token');
    const [recruitmentDetail, setRecruitmentDetail] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [favoriteJobs, setFavoriteJobs] = useState([]);
    const { toast, showSuccess, showError, hideToast } = useToast();


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/detail`, { params: { id: rnid } });
                setRecruitmentDetail(response.data);
            }
            catch {
                setRecruitmentDetail(null);
            }
        };
        if (rnid) fetchDetail();
    }, [rnid]);

    useEffect(() => {
        const fetchRelateJob = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/applicant/relate-jobs`, { params: { id: rnid } });
                setRelatedJobs(response.data);
            }
            catch {
                setRelatedJobs(null);
            }
        };
        if (rnid) fetchRelateJob();
    }, [rnid]);

    const [appliedJobs, setAppliedJobs] = useState([]);
    useEffect(() => {
        if (!token || !applicantID) return;

        const fetchAppliedJob = async () => {
            const res = await axios.get(
                `${API_URL}/api/applicant/applied-job`,
                {
                    params: { id: applicantID },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAppliedJobs(res.data);
        };

        fetchAppliedJob();
    }, [applicantID, token]);

    const appliedJob = appliedJobs.find(job => job.rnid === Number(rnid));


    const calculateRemainingDays = (deadline) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const timeDifference = deadlineDate - currentDate;
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

        if (daysRemaining < 0) return 'Đã hết hạn ứng tuyển';
        return `Còn ${daysRemaining} ngày ứng tuyển`;
    };


    const handleApplyClick = () => {
        const token = localStorage.getItem('token')
        if (token) { setShowForm(true); }
        else {
            navigate('/applicant-login')
            return
        }
    };

    const [cvFile, setCvFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");

    const handleApplyJob = async (e) => {
        e.preventDefault();

        if (!cvFile) {
            showError("Vui lòng chọn CV!");
            return;
        }

        const applicantId = localStorage.getItem("applicantID");

        const formData = new FormData();
        formData.append("CV", cvFile);
        formData.append("coverLetter", coverLetter);
        formData.append("RNID", rnid);
        formData.append("applicantID", applicantId);

        const token = localStorage.getItem("token");

        try {
            const res = await axios.post(
                `${API_URL}/api/applicant/apply`,
                formData,
                {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            showSuccess(res.data.message || "Ứng tuyển thành công!");
            setCoverLetter("");
            closeForm();

        } catch {
            setCoverLetter("");

            showError("Ứng tuyển thất bại. Vui lòng thử lại sau.");
        }
    };

    const closeForm = () => {
        setShowForm(false);
    };
    const navigate = useNavigate();
    const viewDetail = (rnid) => {
        navigate(`/recruitment/${rnid}`);
    }

    const toggleFavorite = async (rnid) => {
        const token = localStorage.getItem('token');
        const applicantID = localStorage.getItem('applicantID')

        if (!token || isTokenExpired(token)) {
            navigate("/applicant-login");
            return;
        }

        await axios.post(
            `${API_URL}/api/applicant/toggle`, null,
            {
                params: { applicantID, rnid },
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setFavoriteJobs(prev =>
            prev.includes(rnid) ? prev.filter(id => id !== rnid) : [...prev, rnid]
        );
    };

    useEffect(() => {
        const fetchSaveJob = async () => {
            const res = await axios.get(
                `${API_URL}/api/applicant/favourite-job`,
                {
                    params: { id: applicantID },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            const savedIds = res.data.map(job => job.rnid);
            setFavoriteJobs(savedIds);
        };
        if (token && applicantID) {
            fetchSaveJob();

        };[applicantID, token]
    })

    const isFavorite = (rnid) => { return favoriteJobs.includes(rnid); }

    const [note, setNote] = useState("");

    useEffect(() => {
        fetch("/note.txt")
            .then((res) => res.text())
            .then((text) => setNote(text))
            .catch((err) => console.error("Lỗi đọc file:", err));
    }, []);

    const paragraphs = note.split(/\r?\n\r?\n/);

    if (!recruitmentDetail) return <div>Loading...</div>;

    const fields = [
        { label: 'Yêu cầu công việc', value: recruitmentDetail.requirement },
        { label: 'Quyền lợi', value: recruitmentDetail.benefit },
        { label: 'Thu nhập', value: formatRangeShort(recruitmentDetail.salary) },
        { label: 'Hình thức làm việc', value: recruitmentDetail.formOfWork },
        { label: 'Cấp bậc', value: recruitmentDetail.level },
        { label: 'Học vấn', value: recruitmentDetail.literacy },
        { label: 'Kinh nghiệm', value: recruitmentDetail.experience },
        { label: 'Địa điểm làm việc', value: recruitmentDetail.location },
        { label: 'Thời gian làm việc', value: recruitmentDetail.workingTime },
        { label: 'Số lượng tuyển', value: recruitmentDetail.quantity },
        { label: 'Hạn nộp hồ sơ', value: formatDate(recruitmentDetail.deadline) },
        { label: 'Cách thức ứng tuyển', value: recruitmentDetail.applyBy },
    ];
    return (
        <>
            <div className={`recruit-wrapper ${token ? 'logged' : 'guest'}`}>
                <div className="recruitment-detail-layout">
                    <div className="left-col">
                        <div className="recruitment-detail-container">
                            <h2 className="recruitment-position">{recruitmentDetail.position}</h2>

                            <div className="summary-detail-info">
                                <div className="info-block">
                                    <div className="info-detail-label">
                                        <FaMoneyBill1Wave className="info-icon" />
                                        <strong> Mức lương:</strong><br />
                                    </div>
                                    <div className="info-detail-value">
                                        <span> {formatRangeShort(recruitmentDetail.salary)}</span>
                                    </div>
                                </div>
                                <div className="info-block">
                                    <div className="info-detail-label">
                                        <RiMapPinFill className="info-icon" />
                                        <strong> Địa điểm làm việc:</strong><br />
                                    </div>
                                    <div className="info-detail-value">
                                        <span> {recruitmentDetail.location}</span>
                                    </div>
                                </div>
                                <div className="info-block">
                                    <div className="info-detail-label">
                                        <CgSandClock className="info-icon" />
                                        <strong> Kinh nghiệm:</strong><br />
                                    </div>
                                    <div className="info-detail-value">
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
                                <button className="detail-apply-btn" onClick={handleApplyClick}>
                                    {appliedJob ? "Ứng tuyển lại" : "Ứng tuyển ngay"}
                                </button>

                                <button
                                    className={`favorite-btn ${isFavorite(recruitmentDetail.rnid) ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(recruitmentDetail.rnid)}
                                >
                                    {isFavorite(recruitmentDetail.rnid) ? <FaHeart /> : <LuHeart />}
                                </button>
                            </div>
                            {appliedJob && (
                                <div className="applied-notice-container">
                                    <p className="applied-notice">
                                        Bạn đã ứng tuyển công việc này vào ngày: <strong>{formatDate(appliedJob.application.date)}</strong>
                                    </p>
                                    <a href={`${API_URL}/uploads/cv/${appliedJob.application.cv}`} className='applied-link'> Xem CV đã nộp</a>
                                </div>

                            )}


                        </div>

                        <div className="job-info">
                            <div className="job-description">
                                <h3>Mô tả công việc</h3>

                                <div
                                    className="job-description"
                                    dangerouslySetInnerHTML={formatDescription(recruitmentDetail.description)}
                                />

                            </div>

                            {fields.map(
                                ({ label, value }) => {
                                    if (!value) return null;


                                    if (label == 'Quyền lợi') {
                                        return (
                                            <div key={label}>
                                                <strong>{label}:</strong>
                                                <div className='benefit-value'
                                                    dangerouslySetInnerHTML={formatDescription(value)}
                                                    style={{ whiteSpace: 'normal', marginTop: '8px', marginLeft: '16px' }}
                                                />
                                            </div>
                                        );
                                    }

                                    if (label == 'Yêu cầu công việc') {
                                        return (
                                            <div key={label}>
                                                <strong>{label}:</strong>
                                                <div className='benefit-value'
                                                    dangerouslySetInnerHTML={formatDescription(value)}
                                                    style={{ whiteSpace: 'normal', marginTop: '8px', marginLeft: '16px' }}
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={label}>
                                            <strong>{label}:</strong> {value}
                                        </div>
                                    );
                                })}
                        </div>

                        <button className="apply-button" onClick={handleApplyClick}>Ứng tuyển</button>
                    </div>
                    <div className="right-col">
                        <div>
                            <h3>Việc làm liên quan</h3>
                        </div>
                        <div>

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
                                            <p className="related-job-salary"><TfiMoney />{" " + formatRangeShort(job.salary)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                </div >

                {showForm && (
                    <div className="detail-popup-form">
                        <div className="popup-detail-message">
                            <h3>Ứng tuyển công việc</h3>
                            <form>
                                <div>
                                    <label>Chọn CV</label>

                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const f = e.target.files[0];
                                            if (f && f.type !== "application/pdf") {
                                                showError("Chỉ được upload file PDF");
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
                                    <p className="require">Lưu ý: Chỉ chứa tối đa 1000 kí tự</p>
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
                )
                }
                {
                    toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={hideToast}
                        />
                    )
                }
            </div >
        </>
    );
};

export default RecruitDetail;
