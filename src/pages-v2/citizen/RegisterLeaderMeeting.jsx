import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Button, Empty, Tag, Spin } from 'antd';
import { Calendar, Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import dayjs from 'dayjs';
import LEADER_MEETING_API from '../../apis/leaderMeeting';

const getDayOfWeek = (dateString) => {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[dayjs(dateString).day()];
};

export default function RegisterLeaderMeeting() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await LEADER_MEETING_API.getSchedules();
      const list = res.data || [];
      const formatted = list.flatMap(item => {
        const dateStr = item.receptionDate ? (item.receptionDate.includes('T') ? item.receptionDate.split('T')[0] : item.receptionDate) : '';
        const slots = item.slots || [];
        return slots.filter(s => (s.remainingCapacity ?? 1) > 0).map(s => ({
          id: `${item.id}-${s.id}`,
          scheduleId: item.id,
          slotId: s.id,
          date: dateStr,
          dayOfWeek: getDayOfWeek(dateStr),
          timeSlot: `${s.startTime} - ${s.endTime}`,
          leader: item.leader?.fullName || 'Lãnh đạo UBND',
          location: item.location || 'Phòng tiếp công dân',
          remainingCapacity: s.remainingCapacity ?? 1
        }));
      });
      setData(formatted);
    } catch (e) {
      console.error('Lỗi khi tải lịch gặp lãnh đạo:', e);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openBookModal = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('scheduleId', selectedSlot.scheduleId);
      formData.append('slotId', selectedSlot.slotId);
      formData.append('fullName', values.name);
      formData.append('phoneNumber', values.phone);
      formData.append('citizenId', values.cccd);
      formData.append('address', values.address || 'Phường Tăng Nhơn Phú');
      formData.append('reason', values.content);

      const res = await LEADER_MEETING_API.createRegistration(formData);
      const regCode = res.data?.registrationCode || res.data?.receptionCode || 'LMR' + Date.now();

      setSuccessInfo({
        code: regCode,
        name: values.name,
        leader: selectedSlot.leader,
        time: `${selectedSlot.timeSlot} ngày ${selectedSlot.date.split('-').reverse().join('/')}`
      });

      message.success('Đăng ký lịch hẹn thành công!');
      setIsModalOpen(false);
      form.resetFields();
      await loadData();
    } catch (error) {
      console.error('Lỗi đăng ký lịch gặp lãnh đạo:', error);
      message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Đăng ký làm việc với Lãnh đạo</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Xin lưu ý, đây là các khung giờ Lãnh đạo có thể tiếp công dân. Vui lòng chọn thời gian phù hợp để đặt lịch.</p>
        </div>

        {availableSlots.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
            <Empty description={<span className="text-gray-500 text-lg">Hiện tại lãnh đạo chưa có khung giờ rảnh nào được cập nhật</span>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableSlots.map(slot => (
              <div
                key={slot.id}
                className="group relative bg-white/90 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => openBookModal(slot)}
              >
                {/* Decorative background shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

                <div className="flex justify-between items-start mb-6">
                  <Tag color="success" className="px-4 py-1.5 rounded-full border-emerald-200 bg-emerald-50 text-emerald-600 font-bold border-0">Đang khả dụng</Tag>
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4 mt-2">
                  <h3 className="text-xl font-extrabold text-gray-800 leading-tight flex items-center">
                    <User className="w-6 h-6 mr-3 text-blue-600" />
                    {slot.leader}
                  </h3>
                  <div className="flex items-center text-gray-600 font-medium">
                    <Calendar className="w-5 h-5 mr-4 text-orange-500" />
                    <span>{slot.dayOfWeek}, {slot.date.split('-').reverse().join('/')}</span>
                  </div>
                  <div className="flex items-center text-gray-600 font-medium">
                    <Clock className="w-5 h-5 mr-4 text-emerald-500" />
                    <span>{slot.timeSlot}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          title={<div className="text-2xl font-extrabold text-gray-800 mb-2">Phiếu Đăng Ký</div>}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          destroyOnClose
          centered
          width={600}
        >
          <div className="bg-blue-50/70 backdrop-blur-md border border-blue-100 p-5 rounded-2xl mb-8 text-blue-900 mt-2">
            <p className="mb-2 flex items-center font-semibold text-base"><User className="w-5 h-5 mr-3 text-blue-600" /> Lãnh đạo: <span className="ml-1 text-gray-800">{selectedSlot?.leader}</span></p>
            <p className="mb-0 flex items-center font-semibold text-base"><Clock className="w-5 h-5 mr-3 text-blue-600" /> Thời gian: <span className="ml-1 text-gray-800">{selectedSlot?.timeSlot} ngày {selectedSlot?.date?.split('-').reverse().join('/')}</span></p>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label={<span className="font-bold text-gray-700">Họ và tên của bạn</span>} rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
              <Input size="large" placeholder="Nguyễn Văn A" className="rounded-xl h-12" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="phone" label={<span className="font-bold text-gray-700">Số điện thoại liên hệ</span>} rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                <Input size="large" placeholder="0909123456" className="rounded-xl h-12" />
              </Form.Item>
              <Form.Item name="cccd" label={<span className="font-bold text-gray-700">Số CCCD / CMND</span>} rules={[{ required: true, message: 'Vui lòng nhập CCCD' }]}>
                <Input size="large" placeholder="079099123456" className="rounded-xl h-12" />
              </Form.Item>
            </div>

            <Form.Item name="address" label={<span className="font-bold text-gray-700">Địa chỉ cư trú</span>}>
              <Input size="large" placeholder="Số nhà, đường, khu phố..." className="rounded-xl h-12" />
            </Form.Item>

            <Form.Item name="content" label={<span className="font-bold text-gray-700">Nội dung tóm tắt vấn đề kiến nghị</span>} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
              <Input.TextArea size="large" rows={4} placeholder="Ví dụ: Xin giải đáp về thủ tục đất đai tại phường..." className="rounded-xl p-3" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" loading={submitting} className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl mt-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
              Xác Nhận Đăng Ký
            </Button>
          </Form>
        </Modal>

        {/* Success Modal */}
        <Modal
          open={!!successInfo}
          onCancel={() => setSuccessInfo(null)}
          footer={[
            <Button key="close" type="primary" size="large" onClick={() => setSuccessInfo(null)} className="w-full bg-blue-600 rounded-xl h-12">
              Đóng
            </Button>
          ]}
          centered
          width={500}
        >
          {successInfo && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng Ký Thành Công!</h3>
              <p className="text-gray-500 text-sm mb-4">Yêu cầu gặp Lãnh đạo của bạn đã được gửi vào hệ thống xét duyệt.</p>
              
              <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 border border-gray-100 mb-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-500 text-xs uppercase font-medium">Mã tra cứu</span>
                  <span className="text-blue-600 font-extrabold text-base">{successInfo.code}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Người đăng ký</span>
                  <span className="font-semibold text-gray-800">{successInfo.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Lãnh đạo tiếp</span>
                  <span className="font-semibold text-gray-800">{successInfo.leader}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Thời gian hẹn</span>
                  <span className="font-semibold text-emerald-600">{successInfo.time}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Vui lòng lưu lại mã tra cứu để theo dõi kết quả phê duyệt từ UBND Phường.</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
