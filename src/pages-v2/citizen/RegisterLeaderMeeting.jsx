import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Button, Empty, Tag } from 'antd';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function RegisterLeaderMeeting() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const loadData = () => {
    const localData = localStorage.getItem('leader-schedules-v1');
    if (localData) {
      setData(JSON.parse(localData));
    }
  };

  const openBookModal = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleSubmit = (values) => {
    const updatedData = data.map(item => {
      if (item.id === selectedSlot.id) {
        return {
          ...item,
          status: 'BOOKED',
          citizenInfo: values
        };
      }
      return item;
    });

    localStorage.setItem('leader-schedules-v1', JSON.stringify(updatedData));
    setData(updatedData);
    message.success('Đăng ký lịch thành công! Cơ quan sẽ liên hệ lại với bạn.');
    setIsModalOpen(false);
    form.resetFields();
  };

  // Lọc ra AVAILABLE và ngày >= hôm nay
  const availableSlots = data
    .filter(d => d.status === 'AVAILABLE' && dayjs(d.date).isAfter(dayjs().subtract(1, 'day')))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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

            <Form.Item name="content" label={<span className="font-bold text-gray-700">Nội dung tóm tắt vấn đề</span>} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
              <Input.TextArea size="large" rows={4} placeholder="Ví dụ: Xin giải đáp về thủ tục đất đai tại phường..." className="rounded-xl p-3" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl mt-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
              Xác Nhận Đăng Ký
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
