import React, { useState, useEffect } from 'react';
import { Form, Button, DatePicker, Select, message, Popconfirm, Tag, TimePicker } from 'antd';
import { Calendar, Clock, Trash2, CalendarPlus } from 'lucide-react';
import dayjs from 'dayjs';

const getDayOfWeek = (dateString) => {
  const days = ['Chá»§ Nháº­t', 'Thá»© Hai', 'Thá»© Ba', 'Thá»© TÆ°', 'Thá»© NÄƒm', 'Thá»© SÃ¡u', 'Thá»© Báº£y'];
  return days[dayjs(dateString).day()];
};

export default function AddSchedule() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [timeType, setTimeType] = useState('SÃ¡ng (09:00 - 10:30)');

  useEffect(() => {
    const localData = localStorage.getItem('leader-schedules-v3');
    if (localData) {
      setData(JSON.parse(localData));
    } else {
      setData([]);
    }
  }, []);

  const onFinish = (values) => {
    let timeSlotStr = values.timeType;
    if (values.timeType === 'KhÃ¡c (Tá»± chá»n thá»i gian)' && values.customTime) {
      timeSlotStr = `${values.customTime[0].format('HH:mm')} - ${values.customTime[1].format('HH:mm')}`;
    }

    const newId = `sched-${Date.now()}`;
    const dateStr = values.date.format('YYYY-MM-DD');

    const newSchedule = {
      id: newId,
      date: dateStr,
      dayOfWeek: getDayOfWeek(dateStr),
      timeSlot: timeSlotStr,
      status: 'AVAILABLE',
    };

    const updatedData = [newSchedule, ...data];
    localStorage.setItem('leader-schedules-v3', JSON.stringify(updatedData));
    setData(updatedData);
    message.success('ThÃªm lá»‹ch ráº£nh thÃ nh cÃ´ng');
    form.resetFields(['date', 'customTime']);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    localStorage.setItem('leader-schedules-v3', JSON.stringify(updatedData));
    setData(updatedData);
    message.success('ÄÃ£ xÃ³a lá»‹ch ráº£nh');
  };

  const availableSlots = data
    .filter(item => item.status === 'AVAILABLE')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="p-4 md:p-6 bg-[#f8f9fa] min-h-screen font-sans">

      {/* Header Card */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col justify-center">
        <div className="flex items-center mb-1">
          <CalendarPlus className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-[20px] font-bold text-gray-800 m-0">ThÃªm Lá»‹ch tiáº¿p cÃ´ng dÃ¢n trá»‘ng</h2>
        </div>
        <p className="text-gray-500 text-[14px] m-0 mt-1">Táº¡o cÃ¡c khung giá» ráº£nh kháº£ dá»¥ng cá»§a LÃ£nh Ä‘áº¡o Ä‘á»ƒ ngÆ°á»i dÃ¢n Ä‘Äƒng kÃ½ tiáº¿p dÃ¢n trá»±c tuyáº¿n.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Column */}
        <div className="w-full lg:w-[35%] bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[16px] text-gray-800 m-0">ThÃªm lá»‹ch ráº£nh má»›i</h3>
          </div>

          <div className="p-5">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ timeType: 'SÃ¡ng (09:00 - 10:30)' }}>

              <Form.Item
                name="date"
                label={<span className="font-medium text-[14px] text-gray-700"><span className="text-red-500 mr-1">*</span>NgÃ y tiáº¿p dÃ¢n</span>}
                rules={[{ required: true, message: 'Vui lÃ²ng chá»n ngÃ y' }]}
                className="mb-4"
              >
                <DatePicker
                  size="large"
                  className="w-full rounded"
                  format="DD/MM/YYYY"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  placeholder="Chá»n ngÃ y tiáº¿p"
                />
              </Form.Item>

              <Form.Item
                name="timeType"
                label={<span className="font-medium text-[14px] text-gray-700"><span className="text-red-500 mr-1">*</span>Khung giá» tiáº¿p</span>}
                className="mb-4"
              >
                <Select size="large" className="rounded w-full" placeholder="SÃ¡ng (09:00 - 10:30)" onChange={(val) => setTimeType(val)}>
                  <Select.Option value="SÃ¡ng (09:00 - 10:30)">SÃ¡ng (09:00 - 10:30)</Select.Option>
                  <Select.Option value="Chiá»u (14:00 - 15:30)">Chiá»u (14:00 - 15:30)</Select.Option>
                  <Select.Option value="KhÃ¡c (Tá»± chá»n thá»i gian)">KhÃ¡c (Tá»± chá»n thá»i gian)</Select.Option>
                </Select>
              </Form.Item>

              {timeType === 'KhÃ¡c (Tá»± chá»n thá»i gian)' && (
                <Form.Item
                  name="customTime"
                  label={<span className="font-medium text-[14px] text-gray-700"><span className="text-red-500 mr-1">*</span>Chá»n khoáº£ng thá»i gian</span>}
                  rules={[{ required: true, message: 'Vui lÃ²ng chá»n thá»i gian' }]}
                  className="mb-6"
                >
                  <TimePicker.RangePicker format="HH:mm" size="large" className="w-full rounded" placeholder={['Tá»« giá»', 'Äáº¿n giá»']} />
                </Form.Item>
              )}

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<Calendar className="w-4 h-4" />}
                className="w-full bg-[#2563eb] hover:bg-blue-700 rounded h-[42px] text-[14px] font-medium shadow-sm border-none mt-2"
              >
                ThÃªm lá»‹ch ráº£nh
              </Button>
            </Form>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[65%] bg-white rounded-lg border border-gray-200 shadow-sm h-fit min-h-[400px]">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[16px] text-gray-800 m-0">Danh sÃ¡ch lá»‹ch ráº£nh kháº£ dá»¥ng</h3>
            <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[12px] font-bold">
              {availableSlots.length}
            </div>
          </div>

          <div className="p-5">
            {availableSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <div className="mb-3 opacity-50 relative">
                  <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center border-b-4 border-gray-300">
                     <div className="w-8 h-8 bg-white rounded shadow-sm border border-gray-100 flex flex-col p-1 space-y-1">
                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                        <div className="w-4/5 h-1 bg-gray-200 rounded"></div>
                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                     </div>
                  </div>
                  <div className="absolute -top-2 -right-4 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-[10px] text-gray-400">...</div>
                </div>
                <p className="text-[14px]">KhÃ´ng cÃ³ khung giá» ráº£nh nÃ o.</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                {availableSlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between bg-white border border-green-200 p-4 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#dcfce7] rounded-lg flex items-center justify-center mr-4">
                        <Clock className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-bold text-[15px] text-gray-900 leading-tight mb-1">
                          {slot.timeSlot}
                        </div>
                        <div className="text-[13px] text-gray-500 leading-tight">
                          {slot.dayOfWeek} â€¢ {slot.date.split('-').reverse().join('/')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-green-600 text-[14px] font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                        Kháº£ dá»¥ng
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-green-400 to-green-300 ml-2 shadow-[0_0_4px_rgba(74,222,128,0.5)]"></div>
                      </div>

                      <Popconfirm
                        title="XoÃ¡ lá»‹ch nÃ y?"
                        onConfirm={() => handleDelete(slot.id)}
                        okText="XÃ³a"
                        cancelText="Há»§y"
                      >
                        <button className="flex items-center text-red-500 hover:text-red-600 text-[14px] font-medium transition-colors">
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          XÃ³a
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
