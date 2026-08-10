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
    message.success('ÄÄƒng kÃ½ lá»‹ch thÃ nh cÃ´ng! CÆ¡ quan sáº½ liÃªn há»‡ láº¡i vá»›i báº¡n.');
    setIsModalOpen(false);
    form.resetFields();
  };

  // Lá»c ra AVAILABLE vÃ  ngÃ y >= hÃ´m nay
  const availableSlots = data
    .filter(d => d.status === 'AVAILABLE' && dayjs(d.date).isAfter(dayjs().subtract(1, 'day')))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">ÄÄƒng kÃ½ lÃ m viá»‡c vá»›i LÃ£nh Ä‘áº¡o</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Xin lÆ°u Ã½, Ä‘Ã¢y lÃ  cÃ¡c khung giá» LÃ£nh Ä‘áº¡o cÃ³ thá»ƒ tiáº¿p cÃ´ng dÃ¢n. Vui lÃ²ng chá»n thá»i gian phÃ¹ há»£p Ä‘á»ƒ Ä‘áº·t lá»‹ch.</p>
        </div>

        {availableSlots.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
            <Empty description={<span className="text-gray-500 text-lg">Hiá»‡n táº¡i lÃ£nh Ä‘áº¡o chÆ°a cÃ³ khung giá» ráº£nh nÃ o Ä‘Æ°á»£c cáº­p nháº­t</span>} />
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
                  <Tag color="success" className="px-4 py-1.5 rounded-full border-emerald-200 bg-emerald-50 text-emerald-600 font-bold border-0">Äang kháº£ dá»¥ng</Tag>
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
          title={<div className="text-2xl font-extrabold text-gray-800 mb-2">Phiáº¿u ÄÄƒng KÃ½</div>}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          destroyOnClose
          centered
          width={600}
        >
          <div className="bg-blue-50/70 backdrop-blur-md border border-blue-100 p-5 rounded-2xl mb-8 text-blue-900 mt-2">
            <p className="mb-2 flex items-center font-semibold text-base"><User className="w-5 h-5 mr-3 text-blue-600" /> LÃ£nh Ä‘áº¡o: <span className="ml-1 text-gray-800">{selectedSlot?.leader}</span></p>
            <p className="mb-0 flex items-center font-semibold text-base"><Clock className="w-5 h-5 mr-3 text-blue-600" /> Thá»i gian: <span className="ml-1 text-gray-800">{selectedSlot?.timeSlot} ngÃ y {selectedSlot?.date?.split('-').reverse().join('/')}</span></p>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label={<span className="font-bold text-gray-700">Há» vÃ  tÃªn cá»§a báº¡n</span>} rules={[{ required: true, message: 'Vui lÃ²ng nháº­p há» tÃªn' }]}>
              <Input size="large" placeholder="Nguyá»…n VÄƒn A" className="rounded-xl h-12" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="phone" label={<span className="font-bold text-gray-700">Sá»‘ Ä‘iá»‡n thoáº¡i liÃªn há»‡</span>} rules={[{ required: true, message: 'Vui lÃ²ng nháº­p SÄT' }]}>
                <Input size="large" placeholder="0909123456" className="rounded-xl h-12" />
              </Form.Item>
              <Form.Item name="cccd" label={<span className="font-bold text-gray-700">Sá»‘ CCCD / CMND</span>} rules={[{ required: true, message: 'Vui lÃ²ng nháº­p CCCD' }]}>
                <Input size="large" placeholder="079099123456" className="rounded-xl h-12" />
              </Form.Item>
            </div>

            <Form.Item name="content" label={<span className="font-bold text-gray-700">Ná»™i dung tÃ³m táº¯t váº¥n Ä‘á»</span>} rules={[{ required: true, message: 'Vui lÃ²ng nháº­p ná»™i dung' }]}>
              <Input.TextArea size="large" rows={4} placeholder="VÃ­ dá»¥: Xin giáº£i Ä‘Ã¡p vá» thá»§ tá»¥c Ä‘áº¥t Ä‘ai táº¡i phÆ°á»ng..." className="rounded-xl p-3" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl mt-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
              XÃ¡c Nháº­n ÄÄƒng KÃ½
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
