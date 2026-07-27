// ============================================================
// OFFICER CHATBOT PAGE — Trợ lý AI Nội bộ Cán bộ UBND Phường Tăng Nhơn Phú
// Chuyên biệt cho Cán bộ xử lý, Cán bộ tiếp nhận, Lãnh đạo & Admin
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, Bot, User, Sparkles, Database, Search, Cpu, 
  FileText, ShieldCheck, Zap, Clock, Users, ArrowRight, RefreshCw,
  BookOpen, Layers, FileCode, HelpCircle, ExternalLink, CheckCircle2,
  Lock, AlertTriangle, ShieldAlert, UserCheck, PhoneCall, Smartphone
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import { publicDocsMock } from '../admin/PublicDocs';
import { internalDocsMock } from '../admin/InternalDocs';

// ----------------------------------------------------------------------
// KNOWLEDGE BASE CHO CÁN BỘ / LÃNH ĐẠO (OFFICER KNOWLEDGE BASE)
// ----------------------------------------------------------------------
const OFFICER_KNOWLEDGE_BASE = [
  {
    keywords: ['chuyển đổi số', 'kế hoạch 2026', 'kế hoạch nội bộ'],
    docId: 'ID001',
    matchedDoc: internalDocsMock.find(d => d.id === 'ID001'),
    answer: `Dựa trên tài liệu nội bộ **"${internalDocsMock.find(d => d.id === 'ID001')?.title}"** (Số hiệu: **${internalDocsMock.find(d => d.id === 'ID001')?.docNumber}** - Bảo mật: **${internalDocsMock.find(d => d.id === 'ID001')?.securityLevel}**):

Kế hoạch Chuyển đổi số Phường Tăng Nhơn Phú 2026 bao gồm các mục tiêu trọng tâm:
• 100% hồ sơ tiếp nhận được số hóa và xử lý trên môi trường điện tử.
• Áp dụng chỉ số SLA theo dõi thời gian xử lý đơn của Cán bộ xử lý (dưới 48h cho đơn phản ánh khẩn SOS).
• Nạp dữ liệu Vector DB cho Trợ lý AI RAG hỗ trợ cán bộ tra cứu quy trình nghiệp vụ nhanh chóng.`,
    suggestions: ['Xem Kế hoạch chuyển đổi số', 'Quy trình xử lý đơn SOS', 'Hạn SLA các phòng ban']
  },
  {
    keywords: ['bổ nhiệm', 'tiếp nhận', 'cán bộ tiếp nhận', 'quyết định 42'],
    docId: 'ID002',
    matchedDoc: internalDocsMock.find(d => d.id === 'ID002'),
    answer: `Dựa trên Quyết định chỉ đạo nội bộ **"${internalDocsMock.find(d => d.id === 'ID002')?.title}"** (Số hiệu: **${internalDocsMock.find(d => d.id === 'ID002')?.docNumber}** - Bảo mật: **${internalDocsMock.find(d => d.id === 'ID002')?.securityLevel}**):

• **Cán bộ phụ trách tiếp nhận hồ sơ:** Vũ Thị Hoa (USR-010) & Mai Văn Khánh (USR-011).
• **Quy trình:** Tiếp nhận, thẩm định tính hợp lệ của phản ánh/hồ sơ và phân công cho Cán bộ xử lý chuyên trách trong vòng 2 giờ làm việc.`,
    suggestions: ['Danh sách cán bộ tiếp nhận', 'Xem phân công đơn vị', 'Quy trình thẩm định hồ sơ']
  },
  {
    keywords: ['gia hạn', 'thời gian gia hạn', 'xin gia hạn', 'sla'],
    docId: 'OFFICER_PROC_01',
    matchedDoc: { docNumber: 'SOP-GH-2026', title: 'Quy trình Đề xuất Gia hạn Hạn xử lý Hồ sơ (Nội bộ Cán bộ)', category: 'Quy trình SOP Nội bộ' },
    answer: `Quy trình **Đề xuất Gia hạn thời gian xử lý** dành cho Cán bộ xử lý:

1. **Điều kiện gia hạn:** Đơn phức tạp cần xác minh hiện trường hoặc phối hợp liên ngành.
2. **Thao tác:** Truy cập trang *Quản lý Gia hạn* (/admin/extensions), chọn đơn và nhập lý do + thời gian xin gia hạn.
3. **Phê duyệt:** Yêu cầu gia hạn sẽ được gửi trực tiếp tới **Lãnh đạo (APPROVER/LEADER)** để xem xét duyệt.`,
    suggestions: ['Trang Quản lý gia hạn', 'Lý do gia hạn hợp lệ', 'Thời gian gia hạn tối đa']
  },
  {
    keywords: ['khai sinh', 'sinh', 'hộ tịch'],
    docId: 'PD002',
    matchedDoc: publicDocsMock.find(d => d.id === 'PD002'),
    answer: `Dựa trên văn bản **"${publicDocsMock.find(d => d.id === 'PD002')?.title}"** (Số hiệu: **${publicDocsMock.find(d => d.id === 'PD002')?.docNumber}**):

Hướng dẫn cán bộ tiếp nhận và xử lý hồ sơ **Đăng ký khai sinh**:
• **Kiểm tra thành phần hồ sơ:** Tờ khai khai sinh, Giấy chứng sinh y tế, CCCD cha mẹ, Giấy ĐKKH, Dữ liệu cư trú VNeID.
• **Thời gian trả kết quả:** Trong ngày làm việc. Cán bộ nhập kết quả số hóa và gửi thông báo qua hệ thống.`,
    suggestions: ['Hồ sơ khai sinh cần gì', 'Quy trình thẩm định khai sinh', 'Liên hệ Bộ phận 1 Cửa']
  },
  {
    keywords: ['xây dựng', 'cấp phép xây dựng', 'giấy phép xây dựng'],
    docId: 'PD004',
    matchedDoc: publicDocsMock.find(d => d.id === 'PD004'),
    answer: `Dựa trên quy định **"${publicDocsMock.find(d => d.id === 'PD004')?.title}"** (Số hiệu: **${publicDocsMock.find(d => d.id === 'PD004')?.docNumber}**):

Quy trình Cán bộ thẩm định hồ sơ **Xin cấp phép xây dựng**:
1. Thẩm định 02 bộ bản vẽ thiết kế thi công đúng quy hoạch lộ giới Phường.
2. Kiểm tra bản cam kết an toàn đối với các công trình liền kề lân cận.
3. Thời hạn thụ lý và trình duyệt không quá 15 ngày làm việc.`,
    suggestions: ['Quy định lộ giới xây dựng', 'Thẩm định bản vẽ thiết kế', 'Thời hạn SLA cấp phép']
  }
];

export default function CitizenChatbot() {
  const { currentRole, currentUser } = useMock();
  const isCitizen = currentRole === 'CITIZEN';

  // Lịch sử tin nhắn dành riêng cho Cán bộ tác nghiệp
  const [messages, setMessages] = useState([
    {
      id: 'off-init',
      sender: 'bot',
      text: `Xin chào Cán bộ **${currentUser?.fullName}** (${currentRole})!\n\nTôi là **Trợ lý AI Nội bộ UBND Phường Tăng Nhơn Phú**.\nTôi được đồng bộ dữ liệu trực tiếp từ **Kho Quản lý Tài liệu Cán bộ** (${internalDocsMock.length} tài liệu nội bộ & ${publicDocsMock.length} tài liệu công khai). Tôi có thể hỗ trợ gì cho đồng chí hôm nay?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      matchedDoc: internalDocsMock[0],
      suggestions: ['Quy trình xin gia hạn đơn', 'Kế hoạch chuyển đổi số 2026', 'Phân công cán bộ tiếp nhận', 'Quy định cấp phép xây dựng']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSearching]);

  // Xử lý gửi tin nhắn
  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isSearching) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSearching(true);

    const lower = textToSend.toLowerCase();
    
    let matchedItem = OFFICER_KNOWLEDGE_BASE.find(item => 
      item.keywords.some(kw => lower.includes(kw))
    );

    if (!matchedItem) {
      matchedItem = {
        answer: `Đã nhận câu hỏi từ Cán bộ **${currentUser?.fullName}**. Trợ lý AI đang hỗ trợ tra cứu trong Kho dữ liệu Quản lý Tài liệu Cán bộ (bao gồm quy trình gia hạn đơn, chỉ đạo chuyển đổi số, quy định quản lý đô thị...). Đồng chí có thể chọn các gợi ý bên dưới để xem chi tiết!`,
        matchedDoc: internalDocsMock[0],
        suggestions: ['Quy trình xin gia hạn đơn', 'Kế hoạch chuyển đổi số 2026', 'Phân công cán bộ tiếp nhận']
      };
    }

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: matchedItem.answer,
        matchedDoc: matchedItem.matchedDoc,
        suggestions: matchedItem.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsSearching(false);
    }, 1100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: `Đã làm mới phiên hội thoại nghiệp vụ. Sẵn sàng hỗ trợ Cán bộ tra cứu tài liệu mới!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedDoc: internalDocsMock[0],
        suggestions: ['Quy trình xin gia hạn đơn', 'Kế hoạch chuyển đổi số 2026', 'Phân công cán bộ tiếp nhận']
      }
    ]);
  };

  // Nếu người dùng chọn nhầm Role Người dân
  if (isCitizen) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center shadow-lg">
          <Smartphone className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Thông báo Hệ thống
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Trợ lý AI trên Web là công cụ dành riêng cho Cán bộ tác nghiệp
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            Hệ thống Trợ lý ảo AI phục vụ người dân hỏi đáp thủ tục hành chính hiện đang được phát triển trên **Ứng dụng Di động (Mobile App)**. 
            Giao diện Web này chỉ phục vụ cho **Cán bộ xử lý, Cán bộ tiếp nhận và Lãnh đạo UBND**.
          </p>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-md"
          >
            Quay lại Gửi phản ánh
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* HEADER BANNER - CHỈ DÀNH CHO CÁN BỘ */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <Bot className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/30 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-purple-200 border border-purple-400/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              CHUYÊN BIỆT TÁC NGHIỆP CÁN BỘ & LÃNH ĐẠO UBND
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Trợ lý AI Nội bộ Cán bộ UBND
              <span className="text-xs px-2.5 py-1 bg-purple-500/40 text-purple-100 rounded-md font-bold uppercase tracking-wider">
                {currentRole}
              </span>
            </h1>
            <p className="text-purple-100 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Công cụ hỗ trợ Cán bộ xử lý tra cứu Quy trình SOP nội bộ, Văn bản bảo mật phòng ban và Kho Quản lý Tài liệu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/documents/internal"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-md"
            >
              <Lock className="w-4 h-4" />
              Tài liệu Nội bộ Cán bộ
            </Link>
            <Link
              to="/admin/documents/public"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              Tài liệu Công khai
            </Link>
            <button
              onClick={handleResetChat}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm border border-white/20 transition-all"
              title="Làm mới phiên chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER (2 COLUMNS LAYOUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CHAT CONSOLE (7/12 on LG) */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-[680px]">
          
          {/* Chat Console Header */}
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-900 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  Trợ lý AI Nội bộ Cán bộ
                  <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 font-semibold rounded-md flex items-center gap-1">
                    Internal Officer Mode
                  </span>
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Đã kết nối {internalDocsMock.length} tài liệu nội bộ & {publicDocsMock.length} công khai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                {currentUser?.fullName} ({currentRole})
              </span>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-800 text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i} className={msg.sender === 'user' ? 'text-white font-bold' : 'text-purple-900 font-bold'}>{part}</strong> : part
                      )}
                    </div>

                    {/* SOURCE CITATION BADGE */}
                    {msg.matchedDoc && (
                      <div className="mt-3.5 pt-3 border-t border-purple-200 bg-purple-50/80 -mx-2 -mb-2 p-2.5 rounded-xl text-xs space-y-1.5 text-purple-900">
                        <div className="flex items-center justify-between font-semibold">
                          <div className="flex items-center gap-1.5 truncate">
                            <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                            <span className="truncate">Nguồn Tài liệu Quản lý Cán bộ:</span>
                          </div>
                          <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded font-mono text-[10px]">
                            {msg.matchedDoc.docNumber || msg.matchedDoc.id}
                          </span>
                        </div>
                        <p className="text-gray-700 text-[11px] font-medium leading-snug line-clamp-2">
                          📄 {msg.matchedDoc.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                          <span className="flex items-center gap-1 font-medium text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" /> Đã xác thực cho {currentRole}
                          </span>
                          <span>{msg.matchedDoc.category || msg.matchedDoc.docType || 'Quy trình SOP'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips under Bot message */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          className="px-3 py-1.5 bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-xs flex items-center gap-1"
                        >
                          <span>{chip}</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] text-gray-400 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gray-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Searching State */}
            {isSearching && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-purple-800 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-none p-4 shadow-sm text-sm space-y-2 max-w-xs">
                  <div className="flex items-center gap-2 text-purple-700 font-medium text-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang truy xuất Kho Dữ liệu Cán bộ Nội bộ...</span>
                  </div>
                  <div className="h-1.5 w-full bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-700 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-400 italic">Đang tìm kiếm quy trình nghiệp vụ & tài liệu chỉ đạo...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cán bộ nhập câu hỏi tác nghiệp, quy trình xin gia hạn, chỉ đạo..."
                className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-gray-800 placeholder-gray-400"
                disabled={isSearching}
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isSearching}
                className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${
                  inputQuery.trim() && !isSearching
                    ? 'bg-purple-800 text-white hover:bg-purple-900 shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
              <span>🛡️ Chế độ Cán bộ: Đã kết nối Kho Tài liệu Nội bộ & Quy trình SOP Phường</span>
              <span className="font-mono text-purple-700 font-semibold">Tác nghiệp: {currentRole}</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: KNOWLEDGE SOURCES FOR OFFICERS */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* BOX 1: DANH SÁCH TÀI LIỆU CÁN BỘ ĐƯỢC TRUY VẤN */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-purple-600" />
                KHO TÀI LIỆU CÁN BỘ (NỘI BỘ & CÔNG KHAI)
              </h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Tài khoản **Cán bộ / Lãnh đạo** được mở khóa truy vấn cả Tài liệu Nội bộ phòng ban và Quy trình SOP đã được duyệt trong chức năng Quản lý Tài liệu:
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {/* Internal Docs */}
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pt-1">
                🔒 Tài liệu Nội bộ UBND ({internalDocsMock.length})
              </div>

              {internalDocsMock.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3 bg-purple-50/60 hover:bg-purple-100/50 rounded-xl border border-purple-200 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-900 bg-purple-200 px-2 py-0.5 rounded text-[10px]">
                      {doc.docNumber} (Nội bộ)
                    </span>
                    <span className="text-[10px] text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-purple-200">
                      <Lock className="w-3 h-3" /> {doc.securityLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 leading-tight">{doc.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-purple-700 pt-0.5 font-medium">
                    <span>Phòng ban: {doc.department}</span>
                    <span>✓ Đã cấp quyền Cán bộ</span>
                  </div>
                </div>
              ))}

              {/* Public Docs */}
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pt-3">
                📌 Tài liệu Công khai ({publicDocsMock.length})
              </div>
              {publicDocsMock.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-gray-200 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[10px]">
                      {doc.docNumber}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Công khai
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 leading-tight">{doc.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                    <span>Danh mục: {doc.category}</span>
                    <span>{doc.issueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOX 2: SUMMARY METRICS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center gap-3">
              <div className="p-2.5 bg-purple-700 text-white rounded-lg shadow-xs"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <div className="font-extrabold text-purple-950 text-sm">NỘI BỘ CÁN BỘ</div>
                <div className="text-[11px] text-purple-700 font-medium">Bảo mật cao</div>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-xs"><Zap className="w-5 h-5" /></div>
              <div>
                <div className="font-extrabold text-indigo-950 text-sm">TRUY VẤN RAG</div>
                <div className="text-[11px] text-indigo-700 font-medium">SOP & Văn bản</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
