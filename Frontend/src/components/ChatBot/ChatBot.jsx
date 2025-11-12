import React, { useEffect, useState } from 'react';
import './ChatBot.css';

const questions = [
    'Introduce yourself and your experience.',
    'What do you understand about React hooks?',
    'How to optimize React apps?',
    'When to use useMemo and useCallback?',
    'What questions do you have about us?'
];

export default function ChatBot() {
    const [idx, setIdx] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [blobUrl, setBlobUrl] = useState('');

    /* ---------- 1. TTS: đọc câu hỏi ---------- */
    const speak = (text) => {
        speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'vi-VN';
        utter.rate = 0.95;
        speechSynthesis.speak(utter);
    };

    useEffect(() => {
        speak(questions[idx]);
    }, [idx]);

    /* ---------- 2. Setup ghi âm ---------- */
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mr = new MediaRecorder(stream);
                const chunks = [];
                mr.ondataavailable = (e) => chunks.push(e.data);
                mr.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    setBlobUrl(url);          // <-- để phát lại
                    console.log('Audio blob:', blob);
                };

                setMediaRecorder(mr);
            })
            .catch(() => alert('Không có quyền microphone'));
    }, []);

    /* ---------- 3. Chấm điểm giả ---------- */
    const fakeScore = (text) => {
        const len = text.trim().length;
        const s = Math.min(100, Math.max(0, Math.round(len / 2)));
        const fb =
            s >= 80
                ? 'Trả lời tốt, nội dung đầy đủ.'
                : s >= 50
                    ? 'Khá ổn, cần bổ sung thêm chi tiết.'
                    : 'Câu trả lời ngắn, hãy mở rộng thêm.';
        return { score: s, feedback: fb };
    };

    /* ---------- 4. Bắt đầu / dừng ghi ---------- */
    const startRecord = () => {
        setTranscript('');
        setScore(null);
        setFeedback('');
        setIsRecording(true);
        mediaRecorder.start();

        const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        rec.lang = 'vi-VN';
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (e) => {
            const t = e.results[e.results.length - 1][0].transcript;
            setTranscript(t);
        };
        rec.start();
        window.recog = rec;
    };

    const stopRecord = () => {
        setIsRecording(false);
        mediaRecorder.stop();
        window.recog && window.recog.stop();


        // chấm điểm
        const { score: s, feedback: f } = fakeScore(transcript);
        setScore(s);
        setFeedback(f);
    };

    /* ---------- 5. Sang câu tiếp ---------- */
    const next = () => {
        if (idx < questions.length - 1) {
            setIdx(idx + 1);
            setTranscript('');
            setScore(null);
            setFeedback('');
        } else {
            alert('Bạn đã hoàn thành bài phỏng vấn!');
        }
    };

    return (
        <div className="card">
            <h2>Câu hỏi {idx + 1}/{questions.length}</h2>
            <p className="question">{questions[idx]}</p>

            {!isRecording ? (
                <button onClick={startRecord}>● Bắt đầu trả lời</button>
            ) : (
                <button onClick={stopRecord}>■ Dừng</button>
            )}

            <p className="transcript">{transcript}</p>

            {score !== null && (
                <div className="result">
                    <strong>Điểm: {score}/100</strong>
                    <br />
                    {feedback}
                    <br />
                    {blobUrl && (
                        <>
                            <audio controls src={blobUrl} />
                            <br />
                        </>
                    )}
                    <button onClick={next}>Tiếp theo →</button>
                </div>
            )}
        </div>
    );
}