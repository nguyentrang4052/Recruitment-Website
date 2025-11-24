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
function RecruitDetail() {

    const { rnid } = useParams();
    const token = localStorage.getItem('token');
    const [recruitmentDetail, setRecruitmentDetail] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [favoriteJobs, setFavoriteJobs] = useState([]);


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/detail", { params: { id: rnid } });
                setRecruitmentDetail(response.data);
            }
            catch (error) {
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
            }
            catch (error) {
                console.error("Lỗi khi tải việc làm liên quan", error);
                setRelatedJobs(null);
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
        const token = localStorage.getItem('token')
        if (token) { setShowForm(true); }
        else {
            navigate('/applicant-login')
            return
        }
    };

    const [cvFile, setCvFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");


    //     e.preventDefault();
    //     if (!cvFile) {
    //         setMsg("Vui lòng chọn CV!");
    //         setMsgType("error");
    //         return;
    //     }


    //     const applicantId = localStorage.getItem("applicantID");

    //     const formData = new FormData();
    //     formData.append("CV", cvFile);
    //     formData.append("coverLetter", coverLetter);
    //     formData.append("RNID", rnid);
    //     formData.append("applicantID", applicantId);

    //     const token = localStorage.getItem("token");

    //     try {
    //         await axios.post(
    //             "http://localhost:8080/api/applicant/apply",
    //             formData,
    //             {
    //                 headers: token ? { Authorization: `Bearer ${token}` } : {},
    //             }
    //         );
    //         alert("Ứng tuyển thành công!");

    //         setCoverLetter(null);
    //         closeForm();
    //     } catch {
    //         setCoverLetter(null);
    //         setMsg("Ứng tuyển thất bại. Vui lòng thử lại. (Chỉ được ứng tuyển 1 lần cho mỗi tin tuyển dụng)");
    //         setMsgType("error");
    //     }
    // };
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

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:8080/api/applicant/apply",
                formData,
                {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            alert("Ứng tuyển thành công!");
            setCoverLetter("");
            closeForm();

        } catch (error) {
            setCoverLetter("");

            console.log("❌ BACKEND ERROR:", error);

            let errorMessage = "Ứng tuyển thất bại. Vui lòng thử lại.";

            setMsg(errorMessage);
            setMsgType("error");
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

        try {
            const res = await axios.post(
                "http://localhost:8080/api/applicant/toggle", null,
                {
                    params: { applicantID, rnid },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log(res.data);

            setFavoriteJobs(prev =>
                prev.includes(rnid) ? prev.filter(id => id !== rnid) : [...prev, rnid]
            );
        } catch (err) {
            console.error("Lỗi khi lưu yêu thích:", err);
        }
    };


    const applicantID = localStorage.getItem('applicantID')
    useEffect(() => {
        const fetchSaveJob = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/applicant/favourite-job",
                    {
                        params: { id: applicantID },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                const savedIds = res.data.map(job => job.rnid);
                setFavoriteJobs(savedIds);
            } catch {
                console.log('Loi khi tai tin yeu thich')
            }
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
        { label: 'Thu nhập', value: recruitmentDetail.salary },
        { label: 'Hình thức làm việc', value: recruitmentDetail.form_of_work },
        { label: 'Cấp bậc', value: recruitmentDetail.level },
        { label: 'Học vấn', value: recruitmentDetail.literacy },
        { label: 'Kinh nghiệm', value: recruitmentDetail.experience },
        { label: 'Địa điểm làm việc', value: recruitmentDetail.location },
        { label: 'Thời gian làm việc', value: recruitmentDetail.working_time },
        { label: 'Số lượng tuyển', value: recruitmentDetail.numbers_of_records && `${recruitmentDetail.numbers_of_records} người` },
        { label: 'Hạn nộp hồ sơ', value: formatDate(recruitmentDetail.deadline) },
        { label: 'Quyền lợi', value: recruitmentDetail.benefit },
        { label: 'Email nộp hồ sơ', value: recruitmentDetail.apply_by, isMail: true },
    ];
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
                                {/* <p style={{ whiteSpace: 'pre-line' }}>{recruitmentDetail.description}</p> */}
                                <div
                                    dangerouslySetInnerHTML={{ __html: recruitmentDetail.description }}
                                    style={{ whiteSpace: 'normal' }}
                                />
                            </div>

                            {fields.map(
                                ({ label, value, isMail }) => {
                                    // value && (
                                    //     <div key={label}>
                                    //         <strong>{label}:</strong> {isMail ? <a href={`mailto:${value}`}>{value}</a> : value}
                                    //     </div>
                                    // )
                                    if (!value) return null;

                                    if (label === 'Quyền lợi') {
                                        return (
                                            <div key={label}>
                                                <strong>{label}:</strong>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: value }}
                                                    style={{ whiteSpace: 'normal', marginTop: '8px', marginLeft: '20px' }}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={label}>
                                            <strong>{label}:</strong> {isMail ? <a href={`mailto:${value}`}>{value}</a> : value}
                                        </div>
                                    );
                                })}
                        </div>

                        <button className="apply-button" onClick={handleApplyClick}>Ứng tuyển ngay</button>
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
                                            <p className="related-job-salary"><TfiMoney />{" " + job.salary}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                </div>

                {showForm && (
                    <div className="detail-popup-form">
                        <div className="popup-message">
                            <h3>Ứng tuyển công việc</h3>
                            {msg && (
                                <div className={`msg-line ${msgType}`}>
                                    <span>{msg}</span>
                                    <button className="msg-close" onClick={() => setMsg("")}>
                                        ×
                                    </button>
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
