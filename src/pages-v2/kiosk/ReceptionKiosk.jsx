import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock3, HeartHandshake, MessageCircle, ShieldCheck, Star, UsersRound } from 'lucide-react';
import { clearReceptionFeedback, readActiveReceptionFeedback, RECEPTION_FEEDBACK_SESSION_EVENT } from '../../citizen/data/receptionFeedbackSession';
import './ReceptionKiosk.css';

export const RECEPTION_FEEDBACK_STORAGE_KEY = 'sos_reception_feedback_v1';

const criteria = [
  { id: 'attitude', label: 'Thái độ phục vụ', hint: 'Lịch sự, lắng nghe và tôn trọng', icon: HeartHandshake },
  { id: 'guidance', label: 'Mức độ hướng dẫn', hint: 'Giải thích rõ ràng, dễ hiểu', icon: MessageCircle },
  { id: 'waiting', label: 'Thời gian chờ đợi', hint: 'Thời gian tiếp nhận và hỗ trợ', icon: Clock3 },
];

const ratingLabels = { 1: 'Rất chưa hài lòng', 2: 'Chưa hài lòng', 3: 'Bình thường', 4: 'Hài lòng', 5: 'Rất hài lòng' };
const reasons = ['Được hướng dẫn rõ ràng', 'Cán bộ lắng nghe và hỗ trợ tận tình', 'Thời gian tiếp nhận phù hợp', 'Quy trình thuận tiện', 'Thái độ phục vụ thân thiện'];

function RatingStars({ value, onChange, label }) {
  return <div className="reception-kiosk-stars" role="radiogroup" aria-label={label}>
    {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= value ? 'is-active' : ''} aria-label={`${star} trên 5 sao`} aria-pressed={star <= value} onClick={() => onChange(star)}><Star size={54} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={1.7} /></button>)}
  </div>;
}

function KioskHeader({ onBack, step, totalSteps }) {
  return <header className="reception-kiosk-header">
    <div className="reception-kiosk-brand"><span className="reception-kiosk-mark"><UsersRound size={22} /></span><span><strong>SOS TNP</strong><small>Đánh giá tiếp dân</small></span></div>
    {step > 0 && step < totalSteps && <button type="button" className="reception-kiosk-back" onClick={onBack}><ChevronLeft size={20} /> Quay lại</button>}
  </header>;
}

export default function ReceptionKiosk() {
  const [activeSession, setActiveSession] = useState(() => readActiveReceptionFeedback());
  const [step, setStep] = useState(0);
  const [overall, setOverall] = useState(0);
  const [criterionRatings, setCriterionRatings] = useState({});
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 4;

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(activeSession);
    if (step === 1) return overall > 0;
    if (step === 2) return criteria.every((item) => criterionRatings[item.id]);
    return true;
  }, [activeSession, criterionRatings, overall, step]);

  useEffect(() => {
    const refreshSession = (event) => {
      const nextSession = event.detail === undefined ? readActiveReceptionFeedback() : event.detail;
      setActiveSession(nextSession);
      if (!nextSession && !submitted) {
        setStep(0);
        setOverall(0);
        setCriterionRatings({});
        setSelectedReasons([]);
        setComment('');
      }
    };
    const refreshFromStorage = (event) => {
      if (event.key === 'sos_reception_feedback_active_v1') refreshSession({ detail: readActiveReceptionFeedback() });
    };
    window.addEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refreshSession);
    window.addEventListener('storage', refreshFromStorage);
    return () => {
      window.removeEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refreshSession);
      window.removeEventListener('storage', refreshFromStorage);
    };
  }, [submitted]);

  useEffect(() => {
    if (!submitted) return undefined;
    const timer = window.setTimeout(() => {
      setStep(0);
      setActiveSession(null);
      setOverall(0);
      setCriterionRatings({});
      setSelectedReasons([]);
      setComment('');
      setSubmitted(false);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const updateCriterion = (id, value) => setCriterionRatings((current) => ({ ...current, [id]: value }));
  const toggleReason = (reason) => setSelectedReasons((current) => current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]);

  const submitFeedback = () => {
    const payload = { id: `TD-${Date.now()}`, type: 'TIEP_DAN', feedbackType: activeSession?.feedbackType, receptionId: activeSession?.receptionId, ticketNo: activeSession?.ticketNo, kioskId: 'KIOSK-TIEP-DAN-01', overall, criteria: criterionRatings, reasons: selectedReasons, comment: comment.trim(), createdAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(window.localStorage.getItem(RECEPTION_FEEDBACK_STORAGE_KEY) || '[]');
      window.localStorage.setItem(RECEPTION_FEEDBACK_STORAGE_KEY, JSON.stringify([...existing, payload]));
    } catch (error) {
      // The kiosk still shows a successful state when browser storage is unavailable.
    }
    clearReceptionFeedback();
    setSubmitted(true);
  };

  const goNext = () => {
    if (!canContinue) return;
    if (step === 3) submitFeedback();
    else setStep((current) => current + 1);
  };
  const goBack = () => setStep((current) => Math.max(0, current - 1));

  if (submitted) return <main className="reception-kiosk reception-kiosk-success"><div className="reception-kiosk-success-card"><div className="reception-kiosk-success-icon"><Check size={42} strokeWidth={2.6} /></div><p className="reception-kiosk-eyebrow">Đã ghi nhận</p><h1>Cảm ơn bạn đã đánh giá</h1><p>Ý kiến của bạn giúp SOS TNP cải thiện chất lượng phục vụ người dân.</p><span className="reception-kiosk-reset-note">Màn hình sẽ sẵn sàng cho người tiếp theo.</span></div></main>;

  return <main className="reception-kiosk">
    <KioskHeader onBack={goBack} step={step} totalSteps={totalSteps} />
    <div className="reception-kiosk-progress" aria-label={`Bước ${step + 1} trên ${totalSteps}`}>{[0, 1, 2, 3].map((item) => <span key={item} className={item <= step ? 'is-active' : ''} />)}</div>
    <section className={`reception-kiosk-content reception-kiosk-step-${step}`}>
      {!activeSession && <div className="reception-kiosk-welcome"><div className="reception-kiosk-hero-icon"><ShieldCheck size={42} /></div><p className="reception-kiosk-eyebrow">SOS TNP · Tiếp dân</p><h1>iPad đang sẵn sàng</h1><p className="reception-kiosk-lead">Cán bộ sẽ chọn phiếu tiếp dân trên màn hình quản lý. Khi được gọi, thông tin phiếu sẽ hiển thị tại đây.</p><div className="reception-kiosk-waiting-pill"><span /> Đang chờ phiên đánh giá</div><p className="reception-kiosk-privacy"><ShieldCheck size={16} /> Không yêu cầu người dân nhập mã hoặc thông tin cá nhân</p></div>}

      {activeSession && step === 0 && <div className="reception-kiosk-welcome"><div className="reception-kiosk-hero-icon"><UsersRound size={42} /></div><p className="reception-kiosk-eyebrow">SOS TNP · {activeSession.feedbackType === 'LEADER_MEETING' ? 'Gặp lãnh đạo' : 'Tiếp dân tại quầy'}</p><h1>Hãy đánh giá trải nghiệm của bạn</h1><div className="reception-kiosk-active-ticket"><span>{activeSession.feedbackType === 'LEADER_MEETING' ? 'Mã phiếu gặp lãnh đạo' : 'Mã phiếu tiếp dân'}</span><strong>{activeSession.ticketNo}</strong><div><b>{activeSession.date}</b><b>{activeSession.slot}</b></div><p>{activeSession.topic}</p></div><button type="button" className="reception-kiosk-primary reception-kiosk-start" onClick={goNext}>Bắt đầu đánh giá <ChevronRight size={22} /></button></div>}

      {activeSession && step === 1 && <div className="reception-kiosk-panel"><p className="reception-kiosk-eyebrow">Bước 1 · Đánh giá chung</p><h1>Buổi tiếp dân hôm nay của bạn thế nào?</h1><p className="reception-kiosk-lead">Chạm vào số sao phù hợp nhất với trải nghiệm của bạn.</p><RatingStars value={overall} onChange={setOverall} label="Đánh giá chung từ 1 đến 5 sao" /><strong className="reception-kiosk-rating-label">{overall ? `${overall}/5 · ${ratingLabels[overall]}` : 'Chọn số sao để tiếp tục'}</strong></div>}

      {activeSession && step === 2 && <div className="reception-kiosk-panel reception-kiosk-criteria-panel"><p className="reception-kiosk-eyebrow">Bước 2 · Các tiêu chí</p><h1>Điều gì tạo nên trải nghiệm của bạn?</h1><p className="reception-kiosk-lead">Chạm chọn số sao cho từng nội dung.</p><div className="reception-kiosk-criteria">{criteria.map(({ id, label, hint, icon: Icon }) => <div className="reception-kiosk-criterion" key={id}><div className="reception-kiosk-criterion-copy"><span><Icon size={21} /></span><div><strong>{label}</strong><small>{hint}</small></div></div><RatingStars value={criterionRatings[id] || 0} onChange={(value) => updateCriterion(id, value)} label={`Đánh giá ${label}`} /></div>)}</div></div>}

      {activeSession && step === 3 && <div className="reception-kiosk-panel reception-kiosk-comment-panel"><p className="reception-kiosk-eyebrow">Bước 3 · Góp ý thêm</p><h1>Bạn có muốn chia sẻ thêm không?</h1><p className="reception-kiosk-lead">Nội dung góp ý là không bắt buộc.</p><div className="reception-kiosk-reasons">{reasons.map((reason) => <button key={reason} type="button" className={selectedReasons.includes(reason) ? 'is-selected' : ''} onClick={() => toggleReason(reason)}>{reason}</button>)}</div><label className="reception-kiosk-comment-field"><span>Góp ý của bạn</span><textarea maxLength={500} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Chia sẻ điều bạn muốn chúng tôi cải thiện..." /><small>{comment.length}/500 ký tự</small></label></div>}
    </section>
    {activeSession && <footer className="reception-kiosk-footer"><span>Đánh giá của bạn được ghi nhận bảo mật.</span><button type="button" className="reception-kiosk-primary" disabled={!canContinue} onClick={goNext}>{step === 3 ? 'Gửi đánh giá' : 'Tiếp tục'} <ChevronRight size={21} /></button></footer>}
  </main>;
}
