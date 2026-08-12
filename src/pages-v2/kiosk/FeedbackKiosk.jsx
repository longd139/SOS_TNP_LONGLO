import React, { useState, useEffect } from 'react';
import { Input, Button, message, ConfigProvider } from 'antd';
import { 
  MessageSquare, Users, ChevronRight, CheckCircle2, 
  Star, ArrowLeft
} from 'lucide-react';

export default function FeedbackKiosk() {
  const [step, setStep] = useState(1);
  const [feedbackType, setFeedbackType] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState('');
  const [targetInfo, setTargetInfo] = useState(null);

  // Auto-reset when reaching step 5
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        resetKiosk();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const resetKiosk = () => {
    setStep(1);
    setFeedbackType('');
    setIdentifier('');
    setRating(0);
    setTags([]);
    setComment('');
    setTargetInfo(null);
  };

  const handleSelectType = (type) => {
    setFeedbackType(type);
    setStep(2);
  };

  const handleVerify = () => {
    if (!identifier.trim()) {
      message.error('Vui lòng nhập Mã hồ sơ hoặc Số điện thoại!');
      return;
    }

    if (feedbackType === 'MEETING') {
      const localSchedules = localStorage.getItem('citizen-approvals-v7');
      if (localSchedules) {
        const schedules = JSON.parse(localSchedules);
        const found = schedules.find(s => s.id === identifier || (s.citizenInfo && s.citizenInfo.phone === identifier));
        if (found) {
          setTargetInfo({
            title: `Lịch tiếp công dân: ${found.leader}`,
            detail: `Thời gian: ${found.date}`,
            code: found.id
          });
          setStep(3);
          return;
        }
      }
      message.error('Không tìm thấy lịch tiếp dân nào khớp với thông tin đã nhập!');
      return;
    } else {
      // Mock for complaints
      setTargetInfo({
        title: 'Xử lý phản ánh, kiến nghị',
        detail: 'Đơn vị: UBND Phường Tăng Nhơn Phú B',
        code: identifier
      });
      setStep(3);
    }
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = () => {
    setStep(5);
  };

  const availableTags = feedbackType === 'MEETING' 
    ? ['Cán bộ tận tình', 'Hướng dẫn rõ ràng', 'Giải quyết thấu đáo', 'Cơ sở vật chất tốt', 'Cần cải thiện thái độ', 'Thời gian chờ lâu']
    : ['Xử lý nhanh chóng', 'Kết quả khách quan', 'Quy trình minh bạch', 'Thông tin chưa rõ ràng', 'Chưa giải quyết triệt để'];

  const ratingLabels = {
    1: 'Rất không hài lòng',
    2: 'Không hài lòng',
    3: 'Bình thường',
    4: 'Hài lòng',
    5: 'Rất hài lòng'
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none overflow-hidden relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-2xl">SOS</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight uppercase">UBND Phường Tăng Nhơn Phú B</h1>
              <p className="text-gray-500 font-medium text-sm mt-1 uppercase">Hệ thống Đánh giá Chất lượng Phục vụ</p>
            </div>
          </div>
          {step > 1 && step < 5 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
          
          {/* STEP 1: CHOOSE SERVICE */}
          {step === 1 && (
            <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-500">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">Kính chào Quý khách!</h2>
                <p className="text-xl text-gray-600 font-medium">Vui lòng chọn lĩnh vực quý khách muốn đánh giá</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={() => handleSelectType('COMPLAINT')}
                  className="group cursor-pointer bg-white hover:bg-blue-50 border-2 border-gray-100 hover:border-blue-400 rounded-3xl p-12 transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-xl"
                >
                  <div className="w-28 h-28 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <MessageSquare className="w-14 h-14" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">Giải quyết Phản ánh</h3>
                  <p className="text-lg text-gray-500 leading-relaxed">Đánh giá quy trình và kết quả xử lý các kiến nghị, phản ánh trực tuyến của quý khách.</p>
                </button>

                <button 
                  onClick={() => handleSelectType('MEETING')}
                  className="group cursor-pointer bg-white hover:bg-emerald-50 border-2 border-gray-100 hover:border-emerald-400 rounded-3xl p-12 transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-xl"
                >
                  <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Users className="w-14 h-14" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-emerald-700 transition-colors">Tiếp Công Dân</h3>
                  <p className="text-lg text-gray-500 leading-relaxed">Đánh giá chất lượng buổi làm việc, tiếp xúc trực tiếp với Lãnh đạo hoặc Cán bộ Phường.</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFICATION */}
          {step === 2 && (
            <div className="w-full max-w-xl animate-in slide-in-from-right-8 duration-500">
              <div className="bg-white border border-gray-200 p-12 rounded-3xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">Xác thực thông tin</h2>
                <p className="text-gray-500 text-center mb-10 font-medium text-lg">Nhập Mã hồ sơ (PA-...) hoặc Số điện thoại để hệ thống ghi nhận đánh giá của quý khách.</p>
                
                <div className="mb-10">
                  <Input 
                    autoFocus
                    size="large"
                    placeholder="VD: PA-1001 hoặc 0901234567"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="text-2xl py-6 px-6 rounded-2xl bg-gray-50 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:bg-white text-center font-bold h-20 w-full"
                    onPressEnter={handleVerify}
                  />
                </div>

                <Button 
                  type="primary"
                  onClick={handleVerify}
                  className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center border-none shadow-md"
                >
                  Tiếp tục đánh giá <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 & 4: RATING & FEEDBACK */}
          {step === 3 && (
            <div className="w-full max-w-4xl bg-white border border-gray-200 p-12 rounded-3xl shadow-lg animate-in slide-in-from-right-8 duration-500 overflow-y-auto max-h-[85vh] custom-scrollbar">
              <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6 leading-snug">
                Quý khách đánh giá thế nào về chất lượng<br/>
                <span className="text-blue-600">{feedbackType === 'MEETING' ? 'Buổi tiếp công dân' : 'Xử lý phản ánh'}</span>?
              </h2>

              {targetInfo && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 text-center">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{targetInfo.title}</h3>
                  <p className="text-blue-600 font-medium mb-1">{targetInfo.detail}</p>
                  <p className="text-blue-500 text-sm">Mã hồ sơ: {targetInfo.code}</p>
                </div>
              )}
              
              {/* Rating Section */}
              <div className="flex justify-center space-x-4 md:space-x-8 mb-12">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="group relative flex flex-col items-center cursor-pointer"
                  >
                    <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-sm border-2 ${
                      rating >= star 
                        ? 'bg-amber-400 border-amber-400 text-white shadow-amber-200/50 shadow-lg' 
                        : 'bg-gray-50 border-gray-200 text-gray-300 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-300'
                    }`}>
                      <Star className={`w-10 h-10 md:w-14 md:h-14 ${rating >= star ? 'fill-current' : ''}`} />
                    </div>
                    <div className="mt-6 h-8">
                      <span className={`text-base font-bold transition-colors whitespace-nowrap px-4 py-1.5 rounded-full ${
                        rating === star ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'text-transparent'
                      }`}>
                        {ratingLabels[star]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tags and Comment Section */}
              <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-full h-px bg-gray-100 mb-10"></div>
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Chi tiết ý kiến đóng góp</h3>
                
                <div className="flex flex-wrap gap-4 mb-10 justify-center">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 border-2 cursor-pointer ${
                        tags.includes(tag) 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="mb-10">
                  <Input.TextArea 
                    rows={4}
                    placeholder="Nhập thêm ý kiến khác của quý khách..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="text-lg p-5 rounded-2xl bg-gray-50 border-gray-200 focus:bg-white w-full"
                  />
                </div>

                <Button 
                  type="primary"
                  onClick={() => {
                    if (rating === 0) {
                      message.error('Vui lòng chọn mức độ hài lòng (số sao) trước khi gửi!');
                      return;
                    }
                    handleSubmit();
                  }}
                  className="w-full h-16 text-xl font-bold bg-green-600 hover:bg-green-700 rounded-2xl flex items-center justify-center border-none shadow-md"
                >
                  Gửi Đánh Giá <CheckCircle2 className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <div className="w-full max-w-2xl text-center animate-in zoom-in duration-500 bg-white border border-gray-200 p-16 rounded-[3rem] shadow-xl">
              <div className="w-32 h-32 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-10">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">Xin chân thành cảm ơn!</h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                Đánh giá của quý khách đã được ghi nhận vào hệ thống. Đây là cơ sở quan trọng để UBND Phường Tăng Nhơn Phú B không ngừng nâng cao chất lượng phục vụ nhân dân.
              </p>
              <div className="inline-flex items-center px-5 py-3 bg-gray-50 rounded-full border border-gray-200 text-gray-500 text-sm font-medium">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse mr-3"></div>
                Hệ thống sẽ tự động trở về trang chủ sau 5 giây...
              </div>
            </div>
          )}

        </div>
        
        {/* Hide scrollbar styles for this specific component */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f9fafb; 
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb; 
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db; 
          }
        `}} />
      </div>
    </ConfigProvider>
  );
}
