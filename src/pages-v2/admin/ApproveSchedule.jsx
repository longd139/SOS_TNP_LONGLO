import React, { useEffect, useState } from 'react';
import { Table, Dropdown, message, Tabs, Modal, Button, Input, Tag } from 'antd';
import LEADER_MEETING_API from '../../apis/leaderMeeting';
import { useMock } from '../../mock/MockContext';
import { ClipboardCheck, User, MoreHorizontal, Eye, Check, X, Award, CalendarCheck, Paperclip } from 'lucide-react';

export default function ApproveSchedule() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [actionModal, setActionModal] = useState({ isOpen: false, action: null, ticketId: null });
  const [actionNote, setActionNote] = useState('');
  const [actionResult, setActionResult] = useState('');

  const { currentUser } = useMock();
  const role = currentUser?.role || 'CITIZEN';
  const isLeaderOrAdmin = ['APPROVER', 'LEADER', 'ADMIN'].includes(role);
  const [loading, setLoading] = useState(false);

  const formatDateDisplay = (dateVal) => {
    if (!dateVal) return '---';
    try {
      const dStr = String(dateVal);
      if (dStr.includes('T')) {
        const dt = new Date(dStr);
        if (!isNaN(dt.getTime())) return dt.toLocaleDateString('vi-VN');
      }
      if (dStr.includes('-')) {
        return dStr.split('-').reverse().join('/');
      }
      return dStr;
    } catch (e) {
      return String(dateVal);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await LEADER_MEETING_API.getRegistrations({ limit: 100 });
      const list = res.data?.data || res.data || [];
      const arrayList = Array.isArray(list) ? list : [];
      const formatted = arrayList.map(item => {
        const itemDate = item.receptionDate ? (item.receptionDate.includes('T') ? item.receptionDate.split('T')[0] : item.receptionDate) : (item.date || '');
        const rawStatus = item.approvalStatus || item.status || 'PENDING';
        const normalizedStatus = rawStatus === 'COMPLETED' ? 'DONE' : rawStatus;
        const leaderName = item.leader?.fullName || item.schedule?.officerName || item.approverName || item.leader || 'Lãnh đạo tiếp dân';
        const applicantName = item.applicant?.fullName || item.applicantName || item.citizenName || '---';
        const applicantPhone = item.applicant?.phoneNumber || item.phoneNumber || item.phone || '---';
        const applicantCccd = item.applicant?.citizenId || item.cccd || '---';
        const applicantAddress = item.applicant?.address || item.address || '---';
        const content = item.reason || item.workingContent || item.topic || item.content || '';

        return {
          ...item,
          key: item.id || item.registrationCode || item.receptionCode,
          id: item.registrationCode || item.receptionCode || item.id,
          rawId: item.id,
          date: itemDate,
          timeSlot: item.timeSlot || item.slot || (item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : '---'),
          leader: leaderName,
          status: normalizedStatus,
          content: content,
          topic: content,
          note: item.rejectReason || item.note || '',
          result: item.result || '',
          attachments: item.attachments || [],
          citizenInfo: {
            name: applicantName,
            phone: applicantPhone,
            cccd: applicantCccd,
            address: applicantAddress,
            content: content
          },
          scheduleInfo: {
            leader: leaderName,
            position: item.approver?.title || 'Lãnh đạo UBND',
            date: itemDate ? itemDate.split('-').reverse().join('/') : '---',
            time: item.timeSlot || item.slot || (item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : '---'),
            room: item.location || item.schedule?.location || 'Phòng tiếp công dân'
          }
        };
      });
      setData(formatted);
    } catch (error) {
      console.error('Lỗi khi tải danh sách lịch gặp lãnh đạo', error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (id, newStatus) => {
    if (newStatus === 'REJECTED' || newStatus === 'CANCELED') {
      setActionModal({ isOpen: true, action: newStatus, ticketId: id });
      setActionNote('');
      setIsModalOpen(false);
      return;
    }
    if (newStatus === 'DONE' || newStatus === 'COMPLETED') {
      setActionModal({ isOpen: true, action: newStatus, ticketId: id });
      setActionNote('');
      setActionResult('');
      setIsModalOpen(false);
      return;
    }
    executeAction(id, newStatus);
  };

  const executeAction = async (id, newStatus, note = '', result = null) => {
    // Find ticket by key or id or rawId
    const target = data.find(d => d.id === id || d.rawId === id || d.key === id);
    const targetId = target?.rawId || target?.id || id;

    try {
      if (newStatus === 'APPROVED') {
        await LEADER_MEETING_API.approveRegistration(targetId);
        message.success('Đã duyệt lịch hẹn gặp lãnh đạo thành công');
      } else if (newStatus === 'REJECTED') {
        const reasonText = note && note.trim().length >= 5 ? note.trim() : 'Lãnh đạo bận lịch công tác đột xuất';
        await LEADER_MEETING_API.rejectRegistration(targetId, reasonText);
        message.success('Đã từ chối lịch hẹn gặp lãnh đạo');
      } else if (newStatus === 'CANCELED') {
        const reasonText = note && note.trim().length >= 5 ? note.trim() : 'Hủy lịch hẹn gặp lãnh đạo';
        await LEADER_MEETING_API.cancelRegistration(targetId, reasonText);
        message.success('Đã hủy lịch hẹn');
      } else if (newStatus === 'PROCESSING') {
        await LEADER_MEETING_API.processRegistration(targetId);
        message.success('Đã chuyển sang trạng thái đang tiếp');
      } else if (newStatus === 'DONE' || newStatus === 'COMPLETED') {
        const resultText = note || (result === 'done' ? 'Đã giải quyết xong nội dung tiếp dân' : 'Cần chuyển bộ phận chuyên môn giải quyết tiếp');
        await LEADER_MEETING_API.completeRegistration(targetId, resultText);
        message.success('Đã đánh dấu hoàn thành buổi tiếp dân');
      }
      
      await fetchData(); // Reload from API
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái lịch hẹn:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }

    setIsModalOpen(false);
    setActionModal({ isOpen: false, action: null, ticketId: null });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const openDetailModal = (record) => {
    setSelectedTicket(record);
    setIsModalOpen(true);
  };

  const openAttachment = async (attachment, download = false) => {
    try {
      const registrationId = selectedTicket?.rawId;
      if (!registrationId || !attachment?.id) return;
      const response = await LEADER_MEETING_API.getRegistrationAttachment(
        registrationId,
        attachment.id,
        download
      );
      const url = window.URL.createObjectURL(response.data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = download ? '_self' : '_blank';
      anchor.rel = 'noopener noreferrer';
      if (download) anchor.download = attachment.originalName || 'tai-lieu-dinh-kem';
      anchor.click();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể mở tài liệu đính kèm');
    }
  };

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[12px] font-bold tracking-wide">
          {text}
        </span>
      )
    },
    {
      title: 'Họ tên / SĐT',
      key: 'citizen',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#eef2fa] text-[#1b64f2] flex items-center justify-center font-bold text-[14px]">
            {getInitials(record.citizenInfo?.name)}
          </div>
          <div>
            <div className="text-[14px] text-gray-800 font-medium leading-none mb-1">
              {record.citizenInfo?.name}
            </div>
            <div className="text-[12px] text-gray-500 leading-none">
              {record.citizenInfo?.phone}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Lãnh đạo được hẹn',
      dataIndex: 'leader',
      key: 'leader',
      render: (text) => (
        <div className="flex items-center text-[13px] text-gray-700">
          <User className="w-3.5 h-3.5 mr-2 text-blue-500" />
          {text}
        </div>
      )
    },
    {
      title: 'Ngày giờ hẹn',
      key: 'time',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-gray-800 leading-none mb-1">{record.timeSlot}</span>
          <span className="text-[12px] text-gray-500 leading-none">{record.dayOfWeek ? `${record.dayOfWeek} — ` : ''}{formatDateDisplay(record.date || record.receptionDate)}</span>
        </div>
      )
    },
    {
      title: 'Nội dung kiến nghị',
      key: 'content',
      render: (_, record) => (
        <div className="text-[13px] text-gray-500 max-w-[300px] truncate" title={record.citizenInfo?.content}>
          {record.citizenInfo?.content}
        </div>
      )
    },
    {
      title: 'Kết quả xử lý',
      key: 'result',
      align: 'center',
      width: 130,
      render: (_, record) => {
        if (record.status === 'PENDING' || record.status === 'APPROVED' || record.status === 'REJECTED' || record.status === 'CANCELED') {
          return <span className="text-gray-400 text-[14px]">—</span>;
        }
        if (record.status === 'DONE') {
          if (record.result === 'done') {
            return <span className="bg-green-50 text-green-600 border border-green-200 text-[12px] font-medium px-2.5 py-1 rounded-full">Đã xong</span>;
          }
          if (record.result === 'not_done') {
            return <span className="bg-red-50 text-red-500 border border-red-200 text-[12px] font-medium px-2.5 py-1 rounded-full">Chưa xong</span>;
          }
          return <span className="text-gray-400 text-[14px]">—</span>;
        }
        return <span className="text-gray-400 text-[14px]">—</span>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        let items = [
          { 
            key: 'view', 
            label: <span className="flex items-center text-gray-700"><Eye className="w-4 h-4 mr-2" /> Xem chi tiết hồ sơ</span>, 
            onClick: () => openDetailModal(record) 
          }
        ];

        if (record.status === 'PENDING' && isLeaderOrAdmin) {
          items.push({ type: 'divider' });
          items.push({ 
            key: 'approve', 
            label: <span className="flex items-center text-[#049669] font-medium"><Check className="w-4 h-4 mr-2" /> Duyệt hẹn</span>, 
            onClick: () => handleAction(record.rawId || record.id, 'APPROVED') 
          });
          items.push({ 
            key: 'reject', 
            label: <span className="flex items-center text-[#ef4444] font-medium"><X className="w-4 h-4 mr-2" /> Từ chối</span>, 
            onClick: () => handleAction(record.rawId || record.id, 'REJECTED') 
          });
        } else if (record.status === 'APPROVED' && isLeaderOrAdmin) {
          items.push({ type: 'divider' });
          items.push({ 
            key: 'process',
            label: <span className="flex items-center text-blue-600 font-medium"><CalendarCheck className="w-4 h-4 mr-2" /> Bắt đầu buổi gặp</span>,
            onClick: () => handleAction(record.rawId || record.id, 'PROCESSING')
          });
          items.push({ 
            key: 'cancel', 
            label: <span className="flex items-center text-[#ef4444] font-medium"><X className="w-4 h-4 mr-2" /> Hủy lịch hẹn</span>, 
            onClick: () => handleAction(record.rawId || record.id, 'CANCELED') 
          });
        } else if (record.status === 'IN_PROGRESS' && isLeaderOrAdmin) {
          items.push({ type: 'divider' });
          items.push({
            key: 'done',
            label: <span className="flex items-center text-blue-600 font-medium"><CalendarCheck className="w-4 h-4 mr-2" /> Đánh dấu Tiếp xong</span>,
            onClick: () => handleAction(record.rawId || record.id, 'DONE')
          });
        }

        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors p-1.5 rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </Dropdown>
        );
      }
    }
  ];

  const safeData = Array.isArray(data) ? data : [];
  const pendingCount = safeData.filter(d => d.status === 'PENDING').length;
  const approvedCount = safeData.filter(d => d.status === 'APPROVED').length;
  const processingCount = safeData.filter(d => d.status === 'IN_PROGRESS').length;
  const doneCount = safeData.filter(d => d.status === 'DONE').length;
  const rejectedCount = safeData.filter(d => d.status === 'REJECTED').length;
  const canceledCount = safeData.filter(d => d.status === 'CANCELED').length;

  const customModalTitle = selectedTicket && (
    <div className="flex items-center justify-between w-full pb-3 border-b border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-[#eef2fa] text-[#1b64f2] flex items-center justify-center font-bold text-[18px]">
          {getInitials(selectedTicket.citizenInfo?.name)}
        </div>
        <div>
          <div className="text-[18px] text-gray-900 font-extrabold leading-none mb-1">
            {selectedTicket.citizenInfo?.name}
          </div>
          <div className="text-[12px] text-gray-400 font-medium leading-none tracking-wide uppercase">
            {selectedTicket.id}
          </div>
        </div>
      </div>
      <div className="mr-8">
        {selectedTicket?.status === 'PENDING' && (
          <span className="border border-red-300 text-red-500 text-[12px] font-medium px-3 py-1 rounded-full bg-white shadow-sm">
            Chờ duyệt
          </span>
        )}
        {selectedTicket?.status === 'APPROVED' && (
          <span className="border border-blue-300 text-blue-600 text-[12px] font-medium px-3 py-1 rounded-full bg-blue-50 shadow-sm">
            Đã duyệt
          </span>
        )}
        {selectedTicket?.status === 'IN_PROGRESS' && (
          <span className="border border-violet-300 text-violet-600 text-[12px] font-medium px-3 py-1 rounded-full bg-violet-50 shadow-sm">
            Đang tiếp
          </span>
        )}
        {selectedTicket?.status === 'DONE' && (
          <span className="border border-green-300 text-green-600 text-[12px] font-medium px-3 py-1 rounded-full bg-green-50 shadow-sm">
            Đã tiếp xong
          </span>
        )}
        {selectedTicket?.status === 'REJECTED' && (
          <span className="border border-orange-300 text-orange-600 text-[12px] font-medium px-3 py-1 rounded-full bg-orange-50 shadow-sm">
            Từ chối
          </span>
        )}
        {selectedTicket?.status === 'CANCELED' && (
          <span className="border border-gray-300 text-gray-500 text-[12px] font-medium px-3 py-1 rounded-full bg-gray-50 shadow-sm">
            Đã hủy
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="schedule-management-font p-4 md:p-6 bg-[#f8f9fa] min-h-screen font-sans">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col justify-center">
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-800 m-0">Phê duyệt & Quản lý Lịch hẹn Tiếp dân</h2>
        </div>
        <p className="text-gray-500 text-[14px] m-0 mt-1">Xem, xét duyệt, theo dõi và đánh giá toàn bộ yêu cầu tiếp xúc công dân với Lãnh đạo Phường.</p>
      </div>



      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Quick tabs bar - Synchronized with system design */}
        <div className="flex border-b border-slate-200 px-4 pt-3 overflow-x-auto bg-slate-50/60">
          {[
            { key: 'PENDING',  label: 'Chờ duyệt',      count: pendingCount },
            { key: 'APPROVED', label: 'Đã duyệt',       count: approvedCount },
            { key: 'IN_PROGRESS', label: 'Đang tiếp',   count: processingCount },
            { key: 'DONE',     label: 'Đã tiếp xong',   count: doneCount },
            { key: 'REJECTED', label: 'Từ chối',        count: rejectedCount },
            { key: 'CANCELED', label: 'Đã hủy',         count: canceledCount },
          ].map(t => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-bold bg-white rounded-t-lg border-x border-t border-slate-200 -mb-[1px] shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>{t.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table view */}
        <div>
          <Table 
            columns={columns} 
            dataSource={safeData.filter(d => d.status === activeTab)} 
            rowKey="id" 
            pagination={false} loading={loading}
            className="custom-table"
          />
        </div>
      </div>

      <Modal
        title={customModalTitle}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={750}
        centered
        closeIcon={<X className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />}
        className="custom-modal"
      >
        {selectedTicket && (
          <div className="mt-4 mb-0 space-y-4">
            
            {/* THÔNG TIN CÔNG DÂN */}
            <div className="bg-[#f8f9fa] rounded-2xl p-4">
              <h4 className="text-[12px] font-bold text-gray-400 mb-3 uppercase tracking-wide">THÔNG TIN CÔNG DÂN</h4>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Họ và tên</div>
                  <div className="font-extrabold text-gray-900 text-[15px]">{selectedTicket.citizenInfo?.name || '---'}</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Điện thoại</div>
                  <div className="font-semibold text-gray-800 text-[15px]">{selectedTicket.citizenInfo?.phone || '---'}</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">CCCD/CMND</div>
                  <div className="font-semibold text-gray-800 text-[15px]">{selectedTicket.citizenInfo?.cccd || '---'}</div>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-gray-400 mb-1">Địa chỉ cư trú</div>
                <div className="font-semibold text-gray-800 text-[15px]">{selectedTicket.citizenInfo?.address || '---'}</div>
              </div>
            </div>

            {/* CHI TIẾT LỊCH HẸN */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4">
              <h4 className="text-[12px] font-bold text-blue-500 mb-3 uppercase tracking-wide">CHI TIẾT LỊCH HẸN</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Lãnh đạo được hẹn</div>
                  <div className="font-extrabold text-gray-900 text-[15px] flex items-center">
                    <Award className="w-4 h-4 mr-2 text-blue-500" />
                    {selectedTicket.leader}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Ngày tiếp</div>
                  <div className="font-semibold text-gray-800 text-[15px]">
                    {formatDateDisplay(selectedTicket.date || selectedTicket.receptionDate)}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Khung giờ</div>
                  <div className="font-semibold text-gray-800 text-[15px]">
                    {selectedTicket.timeSlot}
                  </div>
                </div>
              </div>
            </div>

            {/* LÝ DO */}
            <div className="pt-1">
              <h4 className="text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wide">TOÀN VĂN LÝ DO GẶP MẶT / KIẾN NGHỊ</h4>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="italic text-gray-700 text-[14px] leading-relaxed m-0">
                  "{selectedTicket.citizenInfo?.content}"
                </p>
              </div>
            </div>

            {selectedTicket.attachments?.length > 0 && (
              <div className="pt-1">
                <h4 className="text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wide">TÀI LIỆU ĐÍNH KÈM</h4>
                <div className="space-y-2">
                  {selectedTicket.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3">
                      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-gray-700">
                        <Paperclip className="h-4 w-4 shrink-0 text-blue-500" />
                        <span className="truncate">{attachment.originalName || 'Tài liệu đính kèm'}</span>
                      </span>
                      <span className="flex shrink-0 gap-2">
                        <Button size="small" onClick={() => openAttachment(attachment, false)}>Xem</Button>
                        {attachment.canDownload && <Button size="small" onClick={() => openAttachment(attachment, true)}>Tải xuống</Button>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GHI CHÚ TỪ CHỐI / HỦY (NẾU CÓ) */}
            {selectedTicket.note && (selectedTicket.status === 'REJECTED' || selectedTicket.status === 'CANCELED') && (
              <div className="pt-2">
                <h4 className="text-[12px] font-bold text-red-500 mb-2 uppercase tracking-wide">
                  LÝ DO {selectedTicket.status === 'REJECTED' ? 'TỪ CHỐI' : 'HỦY LỊCH'}
                </h4>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-[14px] leading-relaxed m-0 font-medium">
                    {selectedTicket.note}
                  </p>
                </div>
              </div>
            )}

            {/* KẾT QUẢ XỬ LÝ (NẾU ĐÃ TIẾP XONG) */}
            {selectedTicket.status === 'DONE' && selectedTicket.result && (
              <div className="pt-2">
                <h4 className="text-[12px] font-bold text-blue-500 mb-2 uppercase tracking-wide">KẾT QUẢ XỬ LÝ</h4>
                <div className={`border rounded-xl p-4 ${selectedTicket.result === 'done' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-[14px] leading-relaxed m-0 font-bold ${selectedTicket.result === 'done' ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedTicket.result === 'done' ? 'Đã xong' : 'Chưa xong'}
                  </p>
                  {selectedTicket.note && (
                    <p className="text-gray-600 text-[13px] mt-2 leading-relaxed m-0">{selectedTicket.note}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={actionModal.action === 'DONE' ? 'Xác nhận kết quả tiếp dân' : actionModal.action === 'REJECTED' ? 'Xác nhận từ chối' : 'Xác nhận hủy lịch'}
        open={actionModal.isOpen}
        onCancel={() => setActionModal({ isOpen: false, action: null, ticketId: null })}
        onOk={() => {
          if (actionModal.action === 'DONE') {
            if (!actionResult) { message.warning('Vui lòng chọn kết quả xử lý'); return; }
            executeAction(actionModal.ticketId, actionModal.action, actionNote, actionResult);
          } else {
            executeAction(actionModal.ticketId, actionModal.action, actionNote);
          }
        }}
        okText="Xác nhận"
        cancelText="Bỏ qua"
        okButtonProps={actionModal.action === 'DONE' ? { className: "bg-blue-600 hover:bg-blue-700 border-none shadow-md" } : { danger: true, className: "bg-red-500 hover:bg-red-600 border-none shadow-md" }}
        cancelButtonProps={{ className: "border-none shadow-sm" }}
        centered
      >
        {actionModal.action === 'DONE' ? (
          <>
            <div className="mb-4 text-gray-600 text-[15px]">
              Vui lòng chọn <strong className="text-blue-600">kết quả xử lý</strong> sau buổi tiếp dân:
            </div>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setActionResult('done')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-[15px] font-semibold transition-all cursor-pointer ${
                  actionResult === 'done'
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <Check className="w-5 h-5 mx-auto mb-1" />
                Đã xong
              </button>
              <button
                type="button"
                onClick={() => setActionResult('not_done')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-[15px] font-semibold transition-all cursor-pointer ${
                  actionResult === 'not_done'
                    ? 'border-red-400 bg-red-50 text-red-600 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <X className="w-5 h-5 mx-auto mb-1" />
                Chưa xong
              </button>
            </div>
            <Input.TextArea
              rows={3}
              placeholder="Nhập ghi chú (không bắt buộc)..."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="rounded-xl p-3"
            />
          </>
        ) : (
          <>
            <div className="mb-4 text-gray-600 text-[15px]">
              Bạn có chắc chắn muốn <strong className="text-red-500">{actionModal.action === 'REJECTED' ? 'từ chối' : 'hủy'}</strong> lịch hẹn này không?
            </div>
            <Input.TextArea
              rows={4}
              placeholder="Nhập ghi chú / lý do (không bắt buộc)..."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="rounded-xl p-3"
            />
          </>
        )}
      </Modal>

      <style jsx global>{`
        .custom-tabs .ant-tabs-nav::before {
          display: none;
        }
        .custom-tabs .ant-tabs-tab {
          padding: 0 16px !important;
          margin-right: 8px !important;
        }
        .custom-table .ant-table-thead > tr > th {
          background: #fdfdfd !important;
          color: #4b5563 !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          padding: 12px 16px !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          padding: 16px !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #fafafa !important;
        }
        .custom-modal .ant-modal-content {
          padding: 20px 24px;
          border-radius: 12px;
          overflow: hidden;
        }
        .custom-modal .ant-modal-header {
          margin-bottom: 0;
        }
        .custom-modal .ant-modal-footer {
          margin-top: 0 !important;
        }
        .custom-modal .ant-modal-close {
          top: 20px;
          right: 20px;
        }
      `}</style>
    </div>
  );
}
