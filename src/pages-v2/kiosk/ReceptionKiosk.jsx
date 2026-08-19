import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock3, HeartHandshake, MessageCircle, ShieldCheck, Star, UsersRound, Search } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import './ReceptionKiosk.css';

export const RECEPTION_FEEDBACK_STORAGE_KEY = 'sos_reception_feedback_v1';
export const RECEPTION_FEEDBACK_UPDATED_EVENT = 'sos-reception-feedback-updated';

const fallbackCriteria = [
  { id: 'attitude', label: 'Thái độ phục vụ', hint: 'Lịch sự, lắng nghe và tôn trọng', icon: HeartHandshake },
  { id: 'guidance', label: 'Mức độ hướng dẫn', hint: 'Giải thích rõ ràng, dễ hiểu', icon: MessageCircle },
  { id: 'waiting', label: 'Thời gian chờ đợi', hint: 'Thời gian tiếp nhận và hỗ trợ', icon: Clock3 },
];

const ratingLabels = { 1: 'Rất chưa hài lòng', 2: 'Chưa hài lòng', 3: 'Bình thường', 4: 'Hài lòng', 5: 'Rất hài lòng' };
const positiveReasonGroups = {
  low: ['Ý kiến của tôi đã được tiếp nhận', 'Mong được hướng dẫn rõ ràng hơn', 'Mong thời gian hỗ trợ phù hợp hơn', 'Mong quy trình thuận tiện hơn', 'Cảm ơn cán bộ đã hỗ trợ'],
  medium: ['Được tiếp nhận và hướng dẫn cơ bản', 'Có thể cung cấp thêm thông tin chi tiết', 'Thời gian tiếp nhận tương đối phù hợp', 'Quy trình có thể thuận tiện hơn', 'Cán bộ đã lắng nghe ý kiến'],
  high: ['Được hướng dẫn rõ ràng', 'Cán bộ lắng nghe và hỗ trợ tận tình', 'Thời gian tiếp nhận phù hợp', 'Quy trình thuận tiện', 'Thái độ phục vụ thân thiện'],
};

function RatingStars({ value, onChange, label }) {
  return <div className="reception-kiosk-stars" role="radiogroup" aria-label={label}>
    {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= value ? 'is-active' : ''} aria-label={`${star} trên 5 sao`} aria-pressed={star <= value} onClick={() => onChange(star)}><Star size={54} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={1.7} /></button>)}
  </div>;
}

function KioskHeader({ onBack, step, totalSteps, activeSession }) {
  return <header className="reception-kiosk-header">
    <div className="reception-kiosk-brand"><span className="reception-kiosk-mark"><UsersRound size={22} /></span><span><strong>SOS TNP</strong><small>Đánh giá tiếp dân</small></span></div>
    {activeSession && step > 0 && step < totalSteps && <button type="button" className="reception-kiosk-back" onClick={onBack}><ChevronLeft size={20} /> Quay lại</button>}
  </header>;
}

export default function ReceptionKiosk() {
  const [activeSession, setActiveSession] = useState(null);
  const [step, setStep] = useState(0);
  const [overall, setOverall] = useState(0);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Lookup states
  const [receptionCode, setReceptionCode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Config states
  const [backendSuggestions, setBackendSuggestions] = useState({
    1: ["Cán bộ đã tiếp nhận ý kiến của tôi", "Tôi mong thời gian chờ được rút ngắn hơn", "Tôi mong nội dung hướng dẫn rõ ràng hơn"],
    2: ["Cán bộ có lắng nghe ý kiến", "Tôi mong quy trình được thuận tiện hơn", "Tôi mong được hỗ trợ cụ thể hơn"],
    3: ["Cán bộ giao tiếp lịch sự", "Nội dung hướng dẫn cơ bản rõ ràng", "Thời gian tiếp dân phù hợp"],
    4: ["Cán bộ nhiệt tình và tôn trọng", "Hướng dẫn rõ ràng, dễ hiểu", "Quy trình tiếp dân thuận tiện"],
    5: ["Cán bộ rất tận tình và chuyên nghiệp", "Yêu cầu được giải thích đầy đủ, rõ ràng", "Tôi rất hài lòng với buổi tiếp dân"]
  });

  const totalSteps = 3;

  useEffect(() => {
    // Fetch dynamic criteria configuration
    apiClient.get('/api/reception-ratings/configuration')
      .then(res => {
        const payload = res.data?.data || res.data;
        if (payload?.suggestionsByScore) {
          setBackendSuggestions(payload.suggestionsByScore);
        }
      })
      .catch(err => {
        console.warn("Failed to fetch criteria config, using fallback.", err);
      });
  }, []);

  const suggestedReasons = useMemo(() => {
    const list = backendSuggestions[overall] || backendSuggestions[String(overall)];
    if (list && list.length > 0) return list;

    const scoreSuggestions = overall <= 2 ? positiveReasonGroups.low : overall === 3 ? positiveReasonGroups.medium : positiveReasonGroups.high;
    return scoreSuggestions.slice(0, 5);
  }, [backendSuggestions, overall]);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(activeSession);
    if (step === 1) return overall > 0;
    return true;
  }, [activeSession, overall, step]);

  useEffect(() => {
    if (!submitted) return undefined;
    const timer = window.setTimeout(() => {
      setStep(0);
      setActiveSession(null);
      setOverall(0);
      setSelectedReasons([]);
      setComment('');
      setReceptionCode('');
      setSubmitted(false);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const toggleReason = (reason) => setSelectedReasons((current) => current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]);

  const handleLookup = async (e) => {
    e?.preventDefault();
    if (!receptionCode.trim()) return;
    
    setIsLookingUp(true);
    setLookupError('');
    
    try {
      const res = await apiClient.get(`/api/reception-registrations/rating-lookup/${encodeURIComponent(receptionCode.trim())}`);
      const data = res.data?.data || res.data;
      
      const formatDate = (d) => {
        if (!d) return '';
        try {
          const dateObj = new Date(d);
          if (!isNaN(dateObj.getTime())) {
            return dateObj.toLocaleDateString('vi-VN');
          }
        } catch (e) {}
        return d;
      };

      setActiveSession({
        receptionId: data.registrationId || data.id || data.receptionId,
        ticketNo: data.receptionCode || data.ticketNo || receptionCode.trim().toUpperCase(),
        fullName: data.applicant?.fullName || data.citizenName || data.fullName || 'Người dân',
        phone: data.applicant?.phoneNumber || data.citizenPhone || data.phone || '---',
        topic: data.topic || data.content || data.reason || 'Tiếp dân định kỳ',
        date: formatDate(data.receptionDate || data.date),
        slot: data.timeSlot || data.slot,
      });
      setStep(0);
    } catch (err) {
      if (err.response && [400, 404, 409].includes(err.response.status)) {
        setLookupError(err.response?.data?.message || 'Mã tiếp dân không tồn tại, chưa hoàn thành tiếp dân hoặc đã được đánh giá.');
      } else {
        setLookupError('Có lỗi xảy ra khi tra cứu, vui lòng thử lại sau.');
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const submitFeedback = async () => {
    try {
      const code = (activeSession?.ticketNo || activeSession?.receptionCode || receptionCode || '').trim().toUpperCase();
      const validSuggestionsForScore = backendSuggestions[overall] || backendSuggestions[String(overall)] || [];
      const safeSelectedSuggestions = selectedReasons.filter(r => validSuggestionsForScore.includes(r));

      await apiClient.post('/api/reception-ratings', {
        receptionCode: code,
        score: Number(overall) || 5,
        selectedSuggestions: safeSelectedSuggestions.length > 0 
          ? safeSelectedSuggestions 
          : (validSuggestionsForScore.length > 0 ? [validSuggestionsForScore[0]] : []),
        comment: comment ? comment.trim() : '',
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
    setSubmitted(true);
  };

  const goNext = () => {
    if (!canContinue) return;
    if (step === 2) submitFeedback();
    else setStep((current) => current + 1);
  };
  const goBack = () => setStep((current) => Math.max(0, current - 1));

  if (submitted) return <main className="reception-kiosk reception-kiosk-success"><div className="reception-kiosk-success-card"><div className="reception-kiosk-success-icon"><Check size={42} strokeWidth={2.6} /></div><p className="reception-kiosk-eyebrow">Đã ghi nhận</p><h1>Cảm ơn bạn đã đánh giá</h1><p>Ý kiến của bạn giúp SOS TNP cải thiện chất lượng phục vụ người dân.</p><span className="reception-kiosk-reset-note">Màn hình sẽ sẵn sàng cho người tiếp theo sau vài giây...</span></div></main>;

  return <main className="reception-kiosk">
    <KioskHeader onBack={goBack} step={step} totalSteps={totalSteps} activeSession={activeSession} />
    {activeSession && <div className="reception-kiosk-progress" aria-label={`Bước ${step + 1} trên ${totalSteps}`}>{[0, 1, 2].map((item) => <span key={item} className={item <= step ? 'is-active' : ''} />)}</div>}
    
    <section className={`reception-kiosk-content reception-kiosk-step-${step}`}>
      {!activeSession && <div className="reception-kiosk-welcome">
        <div className="reception-kiosk-hero-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}><Search size={42} /></div>
        <p className="reception-kiosk-eyebrow">SOS TNP · Đánh giá Tiếp dân</p>
        <h1>Tra cứu Hồ sơ Đánh giá</h1>
        <p className="reception-kiosk-lead" style={{ maxWidth: '480px', margin: '0 auto 32px' }}>
          Vui lòng nhập Mã tiếp dân để bắt đầu đánh giá chất lượng phục vụ của cán bộ.
        </p>
        
        <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <input 
            type="text" 
            value={receptionCode} 
            onChange={e => setReceptionCode(e.target.value)} 
            placeholder="VD: PA-1001" 
            style={{ 
              padding: '18px 24px', 
              fontSize: '20px', 
              borderRadius: '16px', 
              border: `2px solid ${lookupError ? '#ef4444' : '#e2e8f0'}`, 
              width: '100%', 
              textAlign: 'center',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          />
          {lookupError && <p style={{ color: '#ef4444', margin: 0, fontSize: '14px', fontWeight: 500 }}>{lookupError}</p>}
          <button 
            type="submit" 
            className="reception-kiosk-primary" 
            disabled={isLookingUp || !receptionCode.trim()}
            style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: '16px', marginTop: '8px' }}
          >
            {isLookingUp ? 'Đang tra cứu...' : 'Tra cứu hồ sơ'}
          </button>
        </form>
        <p className="reception-kiosk-privacy" style={{ marginTop: '48px' }}><ShieldCheck size={16} /> Thông tin đánh giá sẽ được bảo mật tuyệt đối</p>
      </div>}

      {activeSession && step === 0 && <div className="reception-kiosk-welcome"><div className="reception-kiosk-hero-icon"><UsersRound size={42} /></div><p className="reception-kiosk-eyebrow">Hồ sơ hợp lệ</p><h1>Hãy đánh giá trải nghiệm của bạn</h1><div className="reception-kiosk-active-ticket"><span>Mã tiếp dân</span><strong>{activeSession.ticketNo}</strong><div><b>{activeSession.date}</b><b>{activeSession.slot}</b></div><div className="reception-kiosk-citizen"><b>Người dân</b><span>{activeSession.fullName || 'Chưa cập nhật'}</span><b>Điện thoại</b><span>{activeSession.phone || 'Chưa cập nhật'}</span></div><p>{activeSession.topic}</p></div></div>}

      {activeSession && step === 1 && <div className="reception-kiosk-panel"><p className="reception-kiosk-eyebrow">Bước 1 · Đánh giá chung</p><h1>Buổi tiếp dân hôm nay của bạn thế nào?</h1><p className="reception-kiosk-lead">Chạm vào số sao phù hợp nhất với trải nghiệm của bạn.</p><RatingStars value={overall} onChange={setOverall} label="Đánh giá chung từ 1 đến 5 sao" /><strong className="reception-kiosk-rating-label">{overall ? `${overall}/5 · ${ratingLabels[overall]}` : 'Chọn số sao để tiếp tục'}</strong></div>}

      {activeSession && step === 2 && <div className="reception-kiosk-panel reception-kiosk-comment-panel"><p className="reception-kiosk-eyebrow">Bước 2 · Góp ý thêm</p><h1>Bạn có muốn chia sẻ thêm không?</h1><p className="reception-kiosk-lead">Gợi ý được điều chỉnh theo mức đánh giá của bạn. Nội dung góp ý là không bắt buộc.</p><div className="reception-kiosk-reasons">{suggestedReasons.map((reason) => <button key={reason} type="button" className={selectedReasons.includes(reason) ? 'is-selected' : ''} onClick={() => toggleReason(reason)}>{reason}</button>)}</div><label className="reception-kiosk-comment-field"><span>Góp ý của bạn</span><textarea maxLength={500} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Chia sẻ điều bạn muốn chúng tôi cải thiện..." /><small>{comment.length}/500 ký tự</small></label></div>}
    </section>
    
    {activeSession && <footer className="reception-kiosk-footer">
      <button type="button" className="reception-kiosk-back" style={{ color: '#ef4444' }} onClick={() => { setActiveSession(null); setStep(0); setReceptionCode(''); }}>Hủy đánh giá</button>
      <button type="button" className="reception-kiosk-primary" disabled={!canContinue} onClick={goNext}>{step === 2 ? 'Gửi đánh giá' : 'Tiếp tục'} <ChevronRight size={21} /></button>
    </footer>}
  </main>;
}
