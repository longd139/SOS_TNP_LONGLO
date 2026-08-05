// ============================================================
// LEGAL DOC MANAGEMENT — Quản lý Văn bản pháp luật
// Component độc lập, không dùng chung với Tài liệu địa phương
// ============================================================
import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Card, Modal, Form, Input, Select, Upload, message, Dropdown, Space, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, SearchOutlined, EyeOutlined, DownloadOutlined, EllipsisOutlined, SyncOutlined, BookOutlined, UploadOutlined, GlobalOutlined, PictureOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';
import { lawsData as initialLaws } from '../citizen/data/libraryData';

const { Text } = Typography;
const { Option } = Select;

const STORAGE_KEY = 'libraryLawsData_v2';

const STATUS_MAP = {
  DRAFT: { label: 'Bản nháp', color: 'default', bg: 'rgba(100,116,139,0.08)', text: '#475569' },
  PENDING: { label: 'Chờ duyệt', color: 'warning', bg: 'rgba(245,158,11,0.08)', text: '#b45309' },
  APPROVED: { label: 'Đã duyệt', color: 'processing', bg: 'rgba(37,99,235,0.08)', text: '#2563eb' },
  PUBLISHED: { label: 'Đã xuất bản', color: 'success', bg: 'rgba(16,185,129,0.08)', text: '#059669' },
  REJECTED: { label: 'Từ chối', color: 'error', bg: 'rgba(239,68,68,0.08)', text: '#b91c1c' },
  ARCHIVED: { label: 'Đã lưu trữ', color: 'default', bg: 'rgba(100,116,139,0.08)', text: '#64748b' },
};

export default function LegalDocManagement() {
  const { currentUser, currentRole } = useMock();
  const isLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);

  const [laws, setLaws] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return initialLaws.map(l => ({ ...l, adminStatus: 'PUBLISHED', approvedBy: 'Quản trị viên', approvedAt: '2026-01-01' }));
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form] = Form.useForm();

  React.useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(laws)); }, [laws]);

  const kpiStats = useMemo(() => ({
    total: laws.length, published: laws.filter(l => l.adminStatus === 'PUBLISHED').length,
    approved: laws.filter(l => l.adminStatus === 'APPROVED').length,
    pending: laws.filter(l => l.adminStatus === 'PENDING' || l.adminStatus === 'DRAFT').length,
    rejected: laws.filter(l => l.adminStatus === 'REJECTED').length,
    totalViews: laws.reduce((s, l) => s + (l.viewCount || 0), 0),
    totalDownloads: laws.reduce((s, l) => s + (l.downloads || 0), 0),
  }), [laws]);

  const filteredData = useMemo(() => {
    return laws.filter(item => {
      const q = searchText.toLowerCase();
      const matchText = !searchText || item.title?.toLowerCase().includes(q) || (item.issuingAgency || '').toLowerCase().includes(q) || (item.code || '').toLowerCase().includes(q) || item.tags?.some(t => t.toLowerCase().includes(q));
      const matchType = !filterType || item.type === filterType;
      const matchStatus = !filterStatus || item.adminStatus === filterStatus;
      return matchText && matchType && matchStatus;
    });
  }, [laws, searchText, filterType, filterStatus]);

  const columns = useMemo(() => [
    { title: 'TÊN VĂN BẢN', dataIndex: 'title', key: 'title', width: '35%',
      render: (text, record) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 mt-0.5 border border-gray-100">
            {record.cover ? <img src={record.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileTextOutlined /></div>}
          </div>
          <div className="min-w-0"><div className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2">{text}</div><div className="text-[10px] text-gray-400 font-mono mt-0.5">{record.code || ''}</div><div className="text-xs text-gray-400 mt-0.5">{record.issuingAgency || '—'}</div></div>
        </div>
      ),
    },
    { title: 'LOẠI', dataIndex: 'type', key: 'type', width: 100,
      render: (type) => { const colors = { 'Hiến pháp': { bg: 'rgba(234,88,12,0.08)', color: '#EA580C' }, 'Bộ luật': { bg: 'rgba(37,99,235,0.08)', color: '#2563EB' }, 'Luật': { bg: 'rgba(5,150,105,0.08)', color: '#059669' }, 'Nghị định': { bg: 'rgba(124,58,237,0.08)', color: '#7C3AED' } }; const c = colors[type] || { bg: 'rgba(107,114,128,0.08)', color: '#6B7280' }; return <Tag className="rounded border-none px-2.5 py-0.5 font-medium text-[11px]" style={{ backgroundColor: c.bg, color: c.color }}>{type || '—'}</Tag>; },
    },
    { title: 'TRẠNG THÁI PL', dataIndex: 'status', key: 'legalStatus', width: 120,
      render: (s) => <span className={`text-xs font-medium ${s === 'Đang hiệu lực' ? 'text-green-600' : 'text-gray-500'}`}>{s || '—'}</span>,
    },
    { title: 'NGÀY BH', dataIndex: 'issuedDate', key: 'issuedDate', width: 90, render: v => <span className="text-xs text-gray-500">{v || '—'}</span> },
    { title: 'LƯỢT TẢI', dataIndex: 'downloads', key: 'downloads', width: 85, sorter: (a, b) => (a.downloads || 0) - (b.downloads || 0), render: v => <span className="text-xs text-gray-500"><DownloadOutlined className="text-gray-400 mr-1" />{(v || 0).toLocaleString('vi-VN')}</span> },
    { title: 'TRẠNG THÁI', dataIndex: 'adminStatus', key: 'adminStatus', width: 110,
      render: (status) => { const s = STATUS_MAP[status] || STATUS_MAP.DRAFT; return <Tag className="rounded border-none px-2.5 py-0.5 font-semibold text-[11px]" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</Tag>; },
    },
    { title: 'NGƯỜI DUYỆT', dataIndex: 'approvedBy', key: 'approvedBy', width: 110,
      render: (approver) => approver ? <span className="text-xs text-gray-600"><CheckCircleOutlined className="text-green-500 mr-1 text-[10px]" />{approver}</span> : <span className="text-xs text-gray-400 italic">—</span>,
    },
    { title: '', key: 'action', width: 48,
      render: (_, record) => {
        const items = [
          { key: 'view', label: 'Xem chi tiết', icon: <EyeOutlined className="text-blue-600" />, onClick: () => { setSelectedItem(record); setIsDetailOpen(true); } },
          ...(isLeader ? [
            { type: 'divider' },
            { key: 'edit', label: 'Chỉnh sửa', icon: <EditOutlined className="text-indigo-600" />, onClick: () => openEditModal(record) },
            { key: 'status', label: 'Đổi trạng thái', icon: <SyncOutlined className="text-amber-500" />, children: Object.entries(STATUS_MAP).map(([k, v]) => ({ key: `s-${k}`, label: v.label, onClick: () => updateStatus(record.id, k) })) },
            { type: 'divider' },
            { key: 'delete', label: 'Xóa', icon: <DeleteOutlined />, danger: true, onClick: () => { Modal.confirm({ title: 'Xác nhận xóa', content: `Xóa "${record.title}"?`, okText: 'Xóa', okType: 'danger', cancelText: 'Hủy', onOk: () => { setLaws(prev => prev.filter(l => l.id !== record.id)); message.success('Đã xóa!'); } }); } },
          ] : []),
        ];
        return <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight"><Button type="text" shape="circle" icon={<EllipsisOutlined className="text-gray-500" />} /></Dropdown>;
      },
    },
  ], [isLeader]);

  const updateStatus = (id, newStatus) => {
    setLaws(prev => prev.map(item => item.id !== id ? item : { ...item, adminStatus: newStatus, approvedBy: ['APPROVED','PUBLISHED'].includes(newStatus) ? currentUser?.fullName || 'Lãnh đạo' : item.approvedBy, approvedAt: ['APPROVED','PUBLISHED'].includes(newStatus) ? new Date().toISOString().split('T')[0] : item.approvedAt, publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString().split('T')[0] : item.publishedAt, rejectionReason: newStatus === 'REJECTED' ? 'Không đạt yêu cầu' : null }));
    message.success(`Đã chuyển sang: ${STATUS_MAP[newStatus].label}`);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const { file, cover, tags, chapters, ...rest } = values;
      const tagArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : (Array.isArray(tags) ? tags : []);
      const chaptersArray = (chapters || []).map(ch => ({ title: ch.title || '', articles: (ch.articles || '').split('\n').map(a => a.trim()).filter(Boolean) })).filter(ch => ch.title);
      let coverUrl = editingItem?.cover || '';
      if (cover && Array.isArray(cover) && cover.length > 0) { if (cover[0].originFileObj) coverUrl = URL.createObjectURL(cover[0].originFileObj); else if (cover[0].url) coverUrl = cover[0].url; }
      let fileName = editingItem?.fileName || '';
      if (file && Array.isArray(file) && file.length > 0) { if (file[0].originFileObj) fileName = file[0].name; else if (file[0].name) fileName = file[0].name; }

      if (editingItem) {
        setLaws(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...rest, tags: tagArray, chapters: chaptersArray.length > 0 ? chaptersArray : item.chapters, cover: coverUrl || item.cover, fileName: fileName || item.fileName, title: rest.title || item.title, summary: rest.summary || item.summary, updatedAt: new Date().toISOString().split('T')[0] } : item));
        message.success('Đã cập nhật!');
      } else {
        const newLaw = { ...rest, tags: tagArray, chapters: chaptersArray, id: `law-${Date.now()}`, cover: coverUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop', fileName: fileName || 'document.pdf', fileSize: '1.5 MB', downloads: 0, viewCount: 0, adminStatus: 'DRAFT', createdBy: currentUser?.fullName || 'Admin', createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], approvedBy: null, approvedAt: null, publishedAt: null, rejectionReason: null };
        setLaws(prev => [newLaw, ...prev]);
        message.success('Đã tạo văn bản mới!');
      }
      setIsModalOpen(false); setEditingItem(null); form.resetFields();
    }).catch(() => {});
  };

  const openCreateModal = () => { setEditingItem(null); form.resetFields(); form.setFieldsValue({ type: 'Luật', issuingAgency: 'Quốc hội', status: 'Đang hiệu lực', chapters: [] }); setIsModalOpen(true); };

  const openEditModal = (record) => { setEditingItem(record); form.setFieldsValue({ id: record.id, title: record.title || '', type: record.type || '', code: record.code || '', issuingAgency: record.issuingAgency || '', status: record.status || 'Đang hiệu lực', issuedDate: record.issuedDate || '', effectiveDate: record.effectiveDate || '', summary: record.summary || record.description || '', tags: Array.isArray(record.tags) ? record.tags.join(', ') : (record.tags || ''), adminStatus: record.adminStatus || 'DRAFT', chapters: (record.chapters || []).map(ch => ({ ...ch, articles: (ch.articles || []).join('\n') })), cover: record.cover ? [{ uid: '-1', name: 'cover.jpg', status: 'done', url: record.cover }] : [], file: record.fileName ? [{ uid: '-2', name: record.fileName, status: 'done' }] : [] }); setIsModalOpen(true); };

  const bulkApprove = () => {
    const pending = laws.filter(l => l.adminStatus === 'PENDING' || l.adminStatus === 'DRAFT');
    if (!pending.length) { message.info('Không có văn bản nào cần duyệt.'); return; }
    Modal.confirm({ title: 'Duyệt hàng loạt', content: `Duyệt ${pending.length} văn bản đang chờ?`, okText: 'Duyệt', cancelText: 'Hủy', onOk: () => { const ids = new Set(pending.map(l => l.id)); setLaws(prev => prev.map(item => ids.has(item.id) ? { ...item, adminStatus: 'APPROVED', approvedBy: currentUser?.fullName || 'Lãnh đạo', approvedAt: new Date().toISOString().split('T')[0] } : item)); message.success(`Đã duyệt ${pending.length} văn bản!`); } });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div className="flex-1" />
        <Space>
          {isLeader && (
            <Dropdown menu={{ items: [{ key: 'approve', label: <span className="flex items-center gap-2"><CheckCircleOutlined className="text-blue-500" /> Duyệt tất cả ({kpiStats.pending})</span>, onClick: bulkApprove, disabled: kpiStats.pending === 0 }] }} trigger={['click']} placement="bottomRight">
              <Button className="rounded-lg h-10 font-semibold border-2 border-orange-200 bg-orange-50 text-orange-700 hover:!bg-orange-100 flex items-center gap-2 px-4"><CheckOutlined />Duyệt hàng loạt{kpiStats.pending > 0 && <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{kpiStats.pending}</span>}</Button>
            </Dropdown>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} className="bg-orange-600 hover:!bg-orange-700 font-semibold rounded-lg px-4 h-10 flex items-center shadow-sm border-none">Thêm văn bản</Button>
        </Space>
      </div>

      {/* KPI */}
      <Row gutter={[12, 12]}>
        {[{ label: 'Tổng', val: kpiStats.total, icon: <FileTextOutlined />, color: 'orange' }, { label: 'Đã xuất bản', val: kpiStats.published, icon: <GlobalOutlined />, color: 'orange' }, { label: 'Đã duyệt', val: kpiStats.approved, icon: <CheckCircleOutlined />, color: 'blue' }, { label: 'Chờ duyệt', val: kpiStats.pending, icon: <ClockCircleOutlined />, color: 'amber' }, { label: 'Từ chối', val: kpiStats.rejected, icon: <CloseOutlined />, color: 'red' }, { label: 'Lượt xem', val: kpiStats.totalViews.toLocaleString('vi-VN'), icon: <EyeOutlined />, color: 'indigo' }, { label: 'Lượt tải', val: kpiStats.totalDownloads.toLocaleString('vi-VN'), icon: <DownloadOutlined />, color: 'purple' }].map((s, i) => (
          <Col xs={12} sm={8} md={6} lg={Math.floor(24/7)} key={i}><Card className="shadow-sm border border-gray-200 rounded-lg" styles={{ body: { padding: '14px 16px' } }}><div className="flex items-center justify-between"><div><p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">{s.label}</p><h3 className="text-xl font-bold text-gray-800 m-0">{s.val}</h3></div><div className={`bg-${s.color}-50 text-${s.color}-600 p-2.5 rounded-lg text-lg flex items-center`}>{s.icon}</div></div></Card></Col>
        ))}
      </Row>

      {/* Filter */}
      <Card className="shadow-sm border border-gray-200 rounded-lg" styles={{ body: { padding: 16 } }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input prefix={<SearchOutlined className="text-gray-400" />} placeholder="Tìm kiếm theo tiêu đề, số hiệu, cơ quan ban hành..." value={searchText} onChange={e => setSearchText(e.target.value)} allowClear className="rounded-lg h-10 border-gray-300 w-full md:w-80" />
          <Space wrap>
            <Text className="text-xs font-bold text-gray-500 hidden sm:inline">Bộ lọc:</Text>
            <Select placeholder="Loại văn bản" value={filterType || undefined} onChange={setFilterType} style={{ width: 150 }} allowClear className="rounded-lg">
              {['Hiến pháp','Bộ luật','Luật','Nghị định'].map(t => <Option key={t} value={t}>{t}</Option>)}
            </Select>
            <Select placeholder="Trạng thái" value={filterStatus || undefined} onChange={setFilterStatus} style={{ width: 140 }} allowClear className="rounded-lg">
              {Object.entries(STATUS_MAP).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
            </Select>
            {(searchText || filterType || filterStatus) && <Button type="text" danger onClick={() => { setSearchText(''); setFilterType(''); setFilterStatus(''); }} className="font-medium hover:bg-red-50 rounded-lg text-xs">Xóa bộ lọc</Button>}
          </Space>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `Tổng số ${t} văn bản` }} size="middle" />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={<div className="flex items-center gap-2 text-orange-900 pb-1 font-bold text-base"><BookOutlined className="text-orange-600" />{editingItem ? 'Chỉnh sửa văn bản pháp luật' : 'Thêm tài liệu cho Văn bản pháp luật'}</div>}
        open={isModalOpen} onOk={handleSave} onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? 'Cập nhật' : 'Tạo mới'} cancelText="Hủy bỏ" width={760}
        okButtonProps={{ className: 'bg-orange-600 hover:!bg-orange-700 border-none rounded-lg h-9 font-semibold px-6' }} cancelButtonProps={{ className: 'rounded-lg h-9' }}
      >
        <Form form={form} layout="vertical" className="mt-3">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5"><span className="w-1 h-4 bg-orange-500 rounded-full inline-block" />Thông tin cơ bản</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="title" label={<span className="font-semibold text-gray-700 text-xs">Tên văn bản <span className="text-red-400">*</span></span>} rules={[{ required: true }]}><Input placeholder="VD: Luật Đất Đai 2024" className="rounded-lg h-9" /></Form.Item>
            <Form.Item name="code" label={<span className="font-semibold text-gray-700 text-xs">Số hiệu <span className="text-red-400">*</span></span>} rules={[{ required: true }]}><Input placeholder="VD: Số 31/2024/QH15" className="rounded-lg h-9" /></Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5">
            <Form.Item name="type" label={<span className="font-semibold text-gray-700 text-xs">Loại văn bản <span className="text-red-400">*</span></span>} rules={[{ required: true }]}>
              <Select placeholder="Chọn loại" className="rounded-lg">{['Hiến pháp','Bộ luật','Luật','Nghị định'].map(t => <Option key={t} value={t}>{t}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="issuingAgency" label={<span className="font-semibold text-gray-700 text-xs">Cơ quan ban hành <span className="text-red-400">*</span></span>} rules={[{ required: true }]}><Input placeholder="VD: Quốc hội" className="rounded-lg h-9" /></Form.Item>
            <Form.Item name="status" label={<span className="font-semibold text-gray-700 text-xs">Trạng thái hiệu lực</span>}>
              <Select className="rounded-lg">{['Đang hiệu lực','Hết hiệu lực','Chưa có hiệu lực','Sắp có hiệu lực'].map(s => <Option key={s} value={s}>{s}</Option>)}</Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="issuedDate" label={<span className="font-semibold text-gray-700 text-xs">Ngày ban hành</span>}><Input placeholder="VD: 18/01/2024" className="rounded-lg h-9" /></Form.Item>
            <Form.Item name="effectiveDate" label={<span className="font-semibold text-gray-700 text-xs">Ngày hiệu lực</span>}><Input placeholder="VD: 01/07/2024" className="rounded-lg h-9" /></Form.Item>
          </div>
          <Form.Item name="summary" label={<span className="font-semibold text-gray-700 text-xs">Tóm tắt nội dung</span>}><Input.TextArea rows={3} placeholder="Nhập tóm tắt..." className="rounded-lg" /></Form.Item>
          <Form.Item name="tags" label={<span className="font-semibold text-gray-700 text-xs">Tags</span>}><Input placeholder="VD: đất đai, bất động sản" className="rounded-lg h-9" /></Form.Item>

          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 mt-1 flex items-center gap-1.5"><span className="w-1 h-4 bg-orange-500 rounded-full inline-block" />Cấu trúc chương</div>
          <Form.List name="chapters">{(fields, { add, remove }) => (
            <div className="space-y-3">
              {fields.map(({ key, name, ...rest }) => (
                <div key={key} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-gray-600">Chương {name + 1}</span><Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => remove(name)} /></div>
                  <Form.Item {...rest} name={[name, 'title']} label="Tiêu đề" className="mb-2"><Input placeholder="VD: Chương I: Quy định chung" className="rounded-lg h-8 text-xs" /></Form.Item>
                  <Form.Item {...rest} name={[name, 'articles']} label="Điều khoản (mỗi dòng 1 điều)" className="mb-0"><Input.TextArea rows={3} placeholder="Điều 1: ...&#10;Điều 2: ..." className="rounded-lg text-xs" /></Form.Item>
                </div>
              ))}
              <Button type="dashed" onClick={() => add({ title: '', articles: '' })} icon={<PlusOutlined />} block className="rounded-lg text-xs">Thêm chương</Button>
            </div>
          )}</Form.List>

          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 mt-1 flex items-center gap-1.5"><span className="w-1 h-4 bg-orange-500 rounded-full inline-block" />File & Ảnh bìa</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="cover" label="Ảnh bìa" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}><Upload maxCount={1} beforeUpload={() => false} accept="image/*" listType="picture-card"><div className="flex flex-col items-center text-gray-400"><PictureOutlined style={{ fontSize: 22 }} /><span className="text-[10px] mt-1">Tải ảnh</span></div></Upload></Form.Item>
            <Form.Item name="file" label="File văn bản" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}><Upload maxCount={1} beforeUpload={() => false}><Button icon={<UploadOutlined />} className="rounded-lg h-10 border-dashed border-2 w-full">Chọn file</Button></Upload></Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={<div className="flex items-center gap-2 text-orange-900 font-bold text-base"><EyeOutlined className="text-orange-600" />Chi tiết văn bản pháp luật</div>} open={isDetailOpen} onCancel={() => { setIsDetailOpen(false); setSelectedItem(null); }} footer={[<Button key="close" onClick={() => { setIsDetailOpen(false); setSelectedItem(null); }} className="rounded-lg h-9">Đóng</Button>, ...(isLeader && selectedItem ? [<Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { setIsDetailOpen(false); openEditModal(selectedItem); }} className="bg-orange-600 hover:!bg-orange-700 rounded-lg h-9">Chỉnh sửa</Button>] : [])]} width={680}>
        {selectedItem && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">{selectedItem.cover ? <img src={selectedItem.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileTextOutlined style={{ fontSize: 28 }} /></div>}</div>
                <div className="flex-1"><Space size={4} className="mb-1.5"><Tag className="rounded border-none text-[10px]" color="orange">{selectedItem.type}</Tag>{(() => { const s = STATUS_MAP[selectedItem.adminStatus] || STATUS_MAP.DRAFT; return <Tag className="rounded border-none text-[10px]" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</Tag> })()}</Space><h3 className="text-sm font-bold text-gray-900 mb-1">{selectedItem.title}</h3><p className="text-xs text-gray-500 font-mono">{selectedItem.code}</p><p className="text-xs text-gray-400">{selectedItem.issuingAgency}</p></div>
              </div>
            </div>
            <div><div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tóm tắt</div><p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedItem.summary || selectedItem.description || 'Chưa có mô tả'}</p></div>
            <div><div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thông tin pháp lý</div><div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2.5 text-xs bg-gray-50 p-3 rounded-lg">{[['Loại', selectedItem.type], ['Số hiệu', selectedItem.code], ['Cơ quan BH', selectedItem.issuingAgency], ['Ngày BH', selectedItem.issuedDate], ['Ngày HL', selectedItem.effectiveDate], ['Tình trạng', selectedItem.status], ['Lượt tải', (selectedItem.downloads || 0).toLocaleString('vi-VN')]].filter(([,v]) => v).map(([label, val], i) => <div key={i}><span className="text-gray-400 block text-[10px]">{label}</span><span className={`font-medium ${label === 'Tình trạng' && val === 'Đang hiệu lực' ? 'text-green-600' : 'text-gray-800'}`}>{val}</span></div>)}</div></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
