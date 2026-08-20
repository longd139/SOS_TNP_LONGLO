import React, { useState, useEffect } from 'react';
import { Form, Button, DatePicker, Select, message, Popconfirm, TimePicker, Switch, Spin, Tag } from 'antd';
import { Calendar, Clock, Trash2, CalendarPlus } from 'lucide-react';
import dayjs from 'dayjs';
import LEADER_MEETING_API from '../../apis/leaderMeeting';
import { useMock } from '../../mock/MockContext';

const getDayOfWeek = (dateString) => {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[dayjs(dateString).day()];
};

export default function AddSchedule() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeType, setTimeType] = useState('Sáng (09:00 - 10:30)');
  const { currentUser } = useMock();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await LEADER_MEETING_API.getManagementSchedules();
      const list = res.data?.data || res.data || [];
      const arrayList = Array.isArray(list) ? list : [];

      const formatted = arrayList.flatMap(item => {
        const dateStr = item.receptionDate ? (item.receptionDate.includes('T') ? item.receptionDate.split('T')[0] : item.receptionDate) : (item.date || '');
        const slots = item.slots && item.slots.length > 0 ? item.slots : [{
          id: item.id,
          startTime: item.startTime || '09:00',
          endTime: item.endTime || '10:30',
          capacity: item.capacity || 1,
          remainingCapacity: item.remainingCapacity ?? 1
        }];

        return slots.map(slot => ({
          id: item.id,
          slotId: slot.id,
          date: dateStr,
          dayOfWeek: getDayOfWeek(dateStr),
          timeSlot: `${slot.startTime} - ${slot.endTime}`,
          leader: item.leader?.fullName || item.officerName || currentUser?.ho_va_ten || 'Lãnh đạo UBND',
          isActive: item.isActive !== false,
          remainingCapacity: slot.remainingCapacity ?? 1,
          location: item.location || 'Phòng tiếp công dân'
        }));
      });

      setData(formatted);
    } catch (error) {
      console.error('Lỗi khi tải lịch gặp lãnh đạo:', error);
      try {
        const publicRes = await LEADER_MEETING_API.getSchedules();
        const pList = publicRes.data || [];
        const pFormatted = pList.flatMap(item => {
          const dateStr = item.receptionDate ? item.receptionDate.split('T')[0] : '';
          return (item.slots || []).map(slot => ({
            id: item.id,
            slotId: slot.id,
            date: dateStr,
            dayOfWeek: getDayOfWeek(dateStr),
            timeSlot: `${slot.startTime} - ${slot.endTime}`,
            leader: item.leader?.fullName || 'Lãnh đạo UBND',
            isActive: true,
            remainingCapacity: slot.remainingCapacity ?? 1
          }));
        });
        setData(pFormatted);
      } catch (e) {
        setData([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    let startTime = '09:00';
    let endTime = '10:30';

    if (values.timeType === 'Chiều (14:00 - 15:30)') {
      startTime = '14:00';
      endTime = '15:30';
    } else if (values.timeType === 'Khác (Tự chọn thời gian)' && values.customTime) {
      startTime = values.customTime[0].format('HH:mm');
      endTime = values.customTime[1].format('HH:mm');
    }

    const dateStr = values.date.format('YYYY-MM-DD');

    try {
      await LEADER_MEETING_API.createSchedule({
        receptionDate: dateStr,
        location: 'Phòng tiếp công dân',
        note: 'Lịch tiếp công dân định kỳ của Lãnh đạo',
        slots: [
          {
            startTime: startTime,
            endTime: endTime
          }
        ]
      });
      message.success('Thêm lịch rảnh gặp lãnh đạo thành công');
      form.resetFields(['date', 'customTime']);
      await fetchSchedules();
    } catch (error) {
      console.error('Lỗi khi tạo lịch rảnh:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch rảnh');
    }
    setSubmitting(false);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await LEADER_MEETING_API.updateScheduleStatus(id, !currentStatus);
      message.success(`Đã ${!currentStatus ? 'bật' : 'tắt'} lịch hẹn`);
      await fetchSchedules();
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái:', error);
      message.error(error.response?.data?.message || 'Không thể thay đổi trạng thái lịch này');
    }
  };

  const handleDelete = async (id) => {
    try {
      await LEADER_MEETING_API.deleteSchedule(id);
      message.success('Đã xóa lịch rảnh');
      await fetchSchedules();
    } catch (error) {
      console.error('Lỗi khi xóa lịch:', error);
      message.error(error.response?.data?.message || 'Không thể xóa lịch này');
    }
  };

  const availableSlots = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="schedule-management-font p-4 md:p-6 bg-[#f8f9fa] min-h-screen font-sans">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col justify-center">
        <div className="flex items-center mb-1">
          <CalendarPlus className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-[20px] font-bold text-gray-800 m-0">Thêm Lịch tiếp công dân trống</h2>
        </div>
        <p className="text-gray-500 text-[14px] m-0 mt-1">Tạo các khung giờ rảnh khả dụng của Lãnh đạo để người dân đăng ký tiếp dân trực tuyến.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[35%] bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[16px] text-gray-800 m-0">Thêm lịch rảnh mới</h3>
          </div>
          <div className="p-5">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ timeType: 'Sáng (09:00 - 10:30)' }}>
              <Form.Item name="date" label={<span className="font-medium text-[14px] text-gray-700"><span className="text-red-500 mr-1">*</span>Ngày tiếp dân</span>} rules={[{ required: true, message: 'Vui lòng chọn ngày' }]} className="mb-4">
                <DatePicker size="large" className="w-full rounded" format="DD/MM/YYYY" disabledDate={(current) => current && current < dayjs().startOf('day')} placeholder="Chọn ngày tiếp" />
              </Form.Item>
              <Form.Item name="timeType" label={<span className="font-medium text-[14px] text-gray-700"><span className="text-red-500 mr-1">*</span>Khung giờ tiếp</span>} className="mb-4">
                <Select size="large" className="rounded w-full" placeholder="Sáng (09:00 - 10:30)" onChange={(val) => setTimeType(val)}>
                  <Select.Option value="Sáng (09:00 - 10:30)">Sáng (09:00 - 10:30)</Select.Option>
                  <Select.Option value="Chiều (14:00 - 15:30)">Chiều (14:00 - 15:30)</Select.Option>
                  <Select.Option value="Khác (Tự chọn thời gian)">Khác (Tự chọn thời gian)</Select.Option>
                </Select>
              </Form.Item>
              {timeType === 'Khác (Tự chọn thời gian)' && (
                <Form.Item name="customTime" label={<span className="font-medium text-[14px] text-gray-700"><span className="text-red-500 mr-1">*</span>Chọn khoảng thời gian</span>} rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]} className="mb-6">
                  <TimePicker.RangePicker format="HH:mm" size="large" className="w-full rounded" placeholder={['Từ giờ', 'Đến giờ']} />
                </Form.Item>
              )}
              <Button type="primary" htmlType="submit" size="large" loading={submitting} icon={<Calendar className="w-4 h-4" />} className="w-full bg-[#2563eb] hover:bg-blue-700 rounded h-[42px] text-[14px] font-medium shadow-sm border-none mt-2">
                Thêm lịch rảnh
              </Button>
            </Form>
          </div>
        </div>
        <div className="w-full lg:w-[65%] bg-white rounded-lg border border-gray-200 shadow-sm h-fit min-h-[400px]">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[16px] text-gray-800 m-0">Danh sách lịch rảnh Lãnh đạo</h3>
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold">
              {availableSlots.length}
            </div>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Spin tip="Đang tải lịch..." />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p className="text-[14px]">Không có khung giờ rảnh nào của Lãnh đạo.</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                {availableSlots.map(slot => (
                  <div key={slot.slotId || slot.id} className="flex items-center justify-between bg-white border border-gray-200 hover:border-blue-300 p-4 rounded-xl shadow-2xs transition-all">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${slot.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'} rounded-lg flex items-center justify-center mr-4`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[15px] text-gray-900 leading-tight mb-1">
                          {slot.timeSlot}
                        </div>
                        <div className="text-[13px] text-gray-500 leading-tight">
                          {slot.dayOfWeek} • {slot.date.split('-').reverse().join('/')} • <span className="font-medium text-blue-600">{slot.leader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-[13px]">
                        <span className={`mr-2 font-medium ${slot.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {slot.isActive ? 'Bật' : 'Tắt'}
                        </span>
                        <Switch size="small" checked={slot.isActive} onChange={() => handleToggleStatus(slot.id, slot.isActive)} />
                      </div>
                      <Popconfirm title="Xoá lịch này?" onConfirm={() => handleDelete(slot.id)} okText="Xóa" cancelText="Hủy">
                        <button className="flex items-center text-red-500 hover:text-red-600 text-[13px] font-medium transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
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
