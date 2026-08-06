import React, { useState, useRef, useEffect } from 'react';
import { ArrowCounterclockwise, BoxArrowUpRight, Robot, Send, X } from 'react-bootstrap-icons';
import { libraryDocuments, libraryCategories } from '../data/citizenMockDb';

const quickReplies = [
  'Thủ tục hành chính',
  'Gửi phản ánh',
  'Tra cứu hồ sơ',
  'Tìm tài liệu',
  'Liên hệ hỗ trợ',
  'Giờ làm việc',
];

// Build document search index
const docIndex = libraryDocuments.map(d => ({
  id: d.id,
  title: d.title,
  desc: d.description,
  author: d.author,
  category: libraryCategories.find(c => c.id === d.category)?.label || d.category,
  tags: d.tags || [],
  downloads: d.downloads,
}));

function searchDocs(query) {
  const q = query.toLowerCase();
  return docIndex.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.desc.toLowerCase().includes(q) ||
    d.tags.some(t => t.includes(q)) ||
    d.author.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q)
  ).slice(0, 3);
}

const botResponses = {
  'thủ tục': { text: 'Bạn có thể tra cứu thủ tục hành chính tại mục <b>Thủ tục hành chính</b>. Mỗi thủ tục đều có hướng dẫn chi tiết về hồ sơ, trình tự thực hiện và thời gian xử lý.', link: '/cong-dong/thu-tuc', linkText: 'Xem thủ tục →' },
  'phản ánh': { text: 'Bạn vào mục <b>Phản ánh</b> để gửi ý kiến đến chính quyền hoặc tra cứu tiến độ xử lý. Mỗi phản ánh sẽ được cấp một mã số để bạn theo dõi.', link: '/cong-dong/phan-anh', linkText: 'Đi đến Phản ánh →' },
  'tra cứu': { text: 'Bạn có thể tra cứu tiến độ phản ánh bằng mã số tại mục <b>Phản ánh</b>. Vào tab Tra cứu, nhập mã để xem tình trạng xử lý.', link: '/cong-dong/phan-anh?tab=track', linkText: 'Tra cứu ngay →' },
  'liên hệ': { text: '📞 <b>(028) 3896 1234</b><br/>📍 12 Nguyễn Văn Tăng, P. Tăng Nhơn Phú<br/>🕐 Thứ Hai - Thứ Sáu, 7:30 - 17:00', link: '/cong-dong/lien-he', linkText: 'Xem chi tiết →' },
  'thư viện': { text: `📚 <b>Thư viện số</b> có <b>${libraryDocuments.length} tài liệu</b> gồm: sách cộng đồng, tài liệu hướng dẫn, văn bản pháp luật và bản đồ di tích. Bạn muốn tìm tài liệu về chủ đề gì? Hãy gõ từ khóa như: <b>lịch sử</b>, <b>PCCC</b>, <b>môi trường</b>, <b>luật</b>, <b>sức khỏe</b>...`, link: '/cong-dong/thu-vien-so', linkText: 'Vào Thư viện →' },
  'tài liệu': { text: '📚 Hãy cho tôi biết bạn cần tài liệu về chủ đề gì? Ví dụ: <b>lịch sử</b>, <b>pháp luật</b>, <b>PCCC</b>, <b>môi trường</b>, <b>sức khỏe</b>, <b>kỹ năng số</b>, <b>giao thông</b>, <b>di tích</b>... Tôi sẽ tìm giúp bạn!' },
  'dịch vụ công': { text: 'Bạn vào mục <b>Dịch vụ công</b> để xem các dịch vụ trực tuyến như nộp hồ sơ, thanh toán và nhận kết quả tại nhà.', link: '/cong-dong/dich-vu-cong', linkText: 'Xem dịch vụ →' },
  'giờ': { text: '🕐 UBND phường làm việc từ <b>Thứ Hai đến Thứ Sáu</b><br/>⏰ Sáng: 7:30 - 11:30<br/>⏰ Chiều: 13:30 - 17:00' },
  'chào': { text: 'Chào bạn! 👋 Tôi là trợ lý AI của UBND phường Tăng Nhơn Phú. Tôi có thể giúp bạn tra cứu thủ tục, gửi phản ánh, tìm tài liệu, hoặc liên hệ các phòng ban.' },
  'cảm ơn': { text: 'Không có gì ạ! 😊 Chúc bạn một ngày tốt lành. Nếu cần thêm hỗ trợ, cứ nhắn tiếp nhé!' },
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Chào bạn! 👋 Tôi là <b>trợ lý AI</b> của UBND phường Tăng Nhơn Phú. Bạn cần hỗ trợ gì ạ?', time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addBotMessage = (text, link, linkText) => {
    setMessages(prev => [...prev, { role: 'bot', text, link, linkText, time: new Date() }]);
    setLoading(false);
  };

  const send = (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: new Date() }]);
    if (!text) setInput('');
    setLoading(true);
    setShowQuick(false);

    setTimeout(() => {
      const q = userMsg.toLowerCase();
      for (const [key, val] of Object.entries(botResponses)) {
        if (q.includes(key)) {
          addBotMessage(val.text, val.link, val.linkText);
          return;
        }
      }
      // Search library documents
      const found = searchDocs(userMsg);
      if (found.length > 0) {
        const docsList = found.map((d, i) =>
          `${i + 1}. <b>${d.title}</b> — ${d.category} (${d.downloads.toLocaleString('vi-VN')} lượt tải)`
        ).join('<br/>');
        addBotMessage(
          `📚 Tìm thấy <b>${found.length}</b> tài liệu liên quan trong Thư viện số:<br/><br/>${docsList}<br/><br/>💡 Bấm vào link bên dưới để xem chi tiết từng tài liệu.`,
          '/cong-dong/thu-vien-so',
          'Vào Thư viện số →'
        );
        return;
      }
      addBotMessage('Tôi có thể hỗ trợ bạn về: <b>thủ tục hành chính</b>, <b>gửi/tra cứu phản ánh</b>, <b>thư viện số</b>, <b>dịch vụ công</b>, hoặc <b>liên hệ</b> các phòng ban. Bạn thử tìm tài liệu hoặc chọn một chủ đề nhé!');
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const reset = () => {
    setMessages([
      { role: 'bot', text: 'Chào bạn! 👋 Tôi là <b>trợ lý AI</b> của UBND phường Tăng Nhơn Phú. Bạn cần hỗ trợ gì ạ?', time: new Date() },
    ]);
    setShowQuick(true);
    setInput('');
  };

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen(!open)}
        aria-label="Trợ lý AI"
      >
        {open ? <X size={20} /> : (
          <>
            <Robot size={20} />
            <span className="ai-fab-dot" />
          </>
        )}
      </button>

      {open && (
        <div className="ai-popup">
          <div className="ai-popup-header">
            <div className="ai-popup-brand">
              <div className="ai-popup-logo">
                <Robot size={18} />
              </div>
              <div>
                <strong>Trợ lý AI</strong>
                <small>Hỏi đáp thông tin — UBND Tăng Nhơn Phú</small>
              </div>
            </div>
            <button onClick={reset} className="ai-popup-reset" title="Tạo cuộc trò chuyện mới"><ArrowCounterclockwise size={14} /></button>
            <button onClick={() => setOpen(false)} className="ai-popup-close"><X size={16} /></button>
          </div>

          <div className="ai-popup-body">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                {msg.role === 'bot' && (
                  <div className="ai-msg-avatar">
                    <Robot size={14} />
                  </div>
                )}
                <div className="ai-msg-content">
                  <div className="ai-msg-bubble" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  {msg.link && (
                    <a href={msg.link} className="ai-msg-link">
                      {msg.linkText} <BoxArrowUpRight size={12} />
                    </a>
                  )}
                  <span className="ai-msg-time">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-msg bot">
                <div className="ai-msg-avatar"><Robot size={14} /></div>
                <div className="ai-msg-content">
                  <div className="ai-msg-bubble ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {showQuick && messages.length === 1 && (
            <div className="ai-quick-replies">
              <span>Gợi ý câu hỏi:</span>
              <div className="ai-quick-list">
                {quickReplies.map((qr) => (
                  <button key={qr} onClick={() => send(qr)}>{qr}</button>
                ))}
              </div>
            </div>
          )}

          <div className="ai-popup-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
