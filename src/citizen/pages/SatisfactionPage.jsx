import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { complaintStatuses } from '../data/citizenMockDb';
import { SATISFACTION_STORAGE_KEY, SATISFACTION_UPDATED_EVENT, readCitizenRatings, satisfactionLabel, adminSatisfactionMockDb } from '../data/satisfactionData';

export default function SatisfactionPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  // Tìm complaint trong cả 2 nguồn: citizenMockDb + adminSatisfactionMockDb
  const complaintFromStatus = complaintStatuses[code];
  const complaintFromAdmin = adminSatisfactionMockDb.find((item) => item.code === code);
  const isCompleted =
    (complaintFromStatus && (complaintFromStatus.status === 'Đã giải quyết' || complaintFromStatus.status === 'Hoàn thành')) ||
    !!complaintFromAdmin;

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const savedRating = readCitizenRatings().find((item) => item.code === code);
  const alreadyRated = Boolean(savedRating);

  if (!isCompleted) {
    return (
      <section className="citizen-section citizen-container success-page">
        <h1>Chưa thể đánh giá</h1>
        <p>Chỉ phản ánh đã hoàn thành mới có thể đánh giá.</p>
        <button className="citizen-button citizen-button-secondary" onClick={() => navigate('/cong-dong/tra-cuu')}>
          Quay lại tra cứu
        </button>
      </section>
    );
  }

  if (submitted || alreadyRated) {
    return (
      <section className="citizen-section citizen-container success-page">
        <div className="success-icon-v2"><CheckCircle2 size={36} /></div>
        <p className="citizen-eyebrow">Đã ghi nhận</p>
        <h1>Cảm ơn bạn đã đánh giá</h1>
        <p>Đánh giá cho mã phản ánh <strong>{code}</strong> đã được ghi nhận.</p>
        <button className="citizen-button citizen-button-primary" onClick={() => navigate(`/cong-dong/tra-cuu?code=${code}`)}>
          Quay lại tra cứu
        </button>
      </section>
    );
  }

  if (alreadyRated) {
    return <section className="citizen-section citizen-container satisfaction-page">
      <button className="back-link satisfaction-back" onClick={() => navigate(`/cong-dong/tra-cuu?code=${code}`)}><ArrowLeft size={17} /> Quay lại tra cứu</button>
      <div className="satisfaction-card satisfaction-record-card">
        <p className="citizen-eyebrow">SOS-018 · Chi tiết đánh giá</p>
        <h1>Đánh giá đã gửi</h1>
        <p className="satisfaction-reference">Mã phản ánh: <strong>{code}</strong><br />{complaint.title}</p>
        <div className="saved-rating-summary"><div className="satisfaction-stars" aria-label={`${savedRating.score} trên 5 sao`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={30} fill={value <= savedRating.score ? 'currentColor' : 'none'} />)}</div><strong>{savedRating.score}/5 sao · {satisfactionLabel(savedRating.score)}</strong></div>
        <div className="saved-rating-comment"><span>Góp ý</span><p>{savedRating.comment || 'Không có góp ý thêm.'}</p></div>
        <p className="saved-rating-date">Đã gửi ngày {savedRating.ratedAt}</p>
      </div>
    </section>;
  }

  const submit = (event) => {
    event.preventDefault();
    if (!score) return;
    const ratings = readCitizenRatings();
    ratings.push({
      id: `DG-${Date.now()}`,
      code,
      score,
      comment: comment.trim(),
      ratedAt: new Date().toISOString().slice(0, 10),
    });
    window.localStorage.setItem(SATISFACTION_STORAGE_KEY, JSON.stringify(ratings));
    // Dispatch event để Dashboard cập nhật real-time
    window.dispatchEvent(new Event(SATISFACTION_UPDATED_EVENT));
    setSubmitted(true);
  };

  const complaintTitle = complaintFromStatus?.title || complaintFromAdmin?.comment || '';

  return (
    <section className="citizen-section citizen-container satisfaction-page">
      <button className="back-link satisfaction-back" onClick={() => navigate(`/cong-dong/tra-cuu?code=${code}`)}>
        <ArrowLeft size={17} /> Quay lại tra cứu
      </button>
      <div className="satisfaction-card">
        <p className="citizen-eyebrow">SOS-018 · Đánh giá hài lòng</p>
        <h1>Đánh giá chất lượng phục vụ</h1>
        <p className="satisfaction-reference">
          Mã phản ánh: <strong>{code}</strong>
          {complaintTitle && <><br />{complaintTitle}</>}
        </p>
        <form onSubmit={submit}>
          <fieldset className="satisfaction-rating-field">
            <legend>Mức độ hài lòng của bạn</legend>
            <div className="satisfaction-stars" role="radiogroup" aria-label="Chấm điểm từ 1 đến 5 sao">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={value <= score ? 'active' : ''}
                  aria-label={`${value} sao`}
                  aria-pressed={value <= score}
                  onClick={() => setScore(value)}
                >
                  <Star size={38} fill={value <= score ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <strong className="satisfaction-label">
              {score ? `${score}/5 sao · ${satisfactionLabel(score)}` : 'Chọn số sao để đánh giá'}
            </strong>
          </fieldset>
          <label className="satisfaction-comment">
            <span>Góp ý thêm <small>(không bắt buộc)</small></span>
            <textarea
              maxLength={2000}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Chia sẻ thêm trải nghiệm của bạn..."
            />
            <small>{comment.length}/2000 ký tự</small>
          </label>
          <button type="submit" disabled={!score} className="citizen-button citizen-button-primary full-width">
            Gửi đánh giá
          </button>
        </form>
      </div>
    </section>
  );
}