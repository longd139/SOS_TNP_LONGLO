// ============================================================
// ADMIN LIBRARY MANAGEMENT - Quan ly Thu Vien So
// Route: /admin/library
// ============================================================
import React, { useState, useMemo } from 'react';
import {
  Table, Button, Typography, Tag, Card, Modal, Form, Input, Select,
  Upload, message, Dropdown, Tabs, Space, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined,
  CheckCircleOutlined, ClockCircleOutlined, SearchOutlined,
  EyeOutlined, DownloadOutlined, EllipsisOutlined, SyncOutlined,
  BookOutlined, UploadOutlined, FilePdfOutlined, FileWordOutlined,
  GlobalOutlined, PictureOutlined, UserOutlined,
  CheckOutlined, ExclamationCircleOutlined,
  ReloadOutlined, FilterOutlined, AppstoreOutlined,
  EyeInvisibleOutlined, SendOutlined, CloseOutlined,
} from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';
import {
  libraryDocuments as initialLibraryDocs,
  lawsData as initialLawsData,
  libraryCategories,
} from '../citizen/data/libraryData';

const { Title, Text } = Typography;
const { Option } = Select;

// ============================================
const STORAGE_KEY_DOCS = 'libraryDocsData_v2';
const STORAGE_KEY_LAWS = 'libraryLawsData_v2';

const STATUS_MAP = {
  DRAFT:     { label: 'Bản nháp',     color: 'default',    bg: 'rgba(100,116,139,0.08)', text: '#475569', icon: <FileTextOutlined /> },
  PENDING:   { label: 'Chờ duyệt',    color: 'warning',    bg: 'rgba(245,158,11,0.08)', text: '#b45309', icon: <ClockCircleOutlined /> },
  APPROVED:  { label: 'Đã duyệt',     color: 'processing', bg: 'rgba(37,99,235,0.08)',  text: '#2563eb', icon: <CheckCircleOutlined /> },
  PUBLISHED: { label: 'Đã xuất bản',  color: 'success',    bg: 'rgba(16,185,129,0.08)', text: '#059669', icon: <GlobalOutlined /> },
  REJECTED:  { label: 'Từ chối',      color: 'error',      bg: 'rgba(239,68,68,0.08)',  text: '#b91c1c', icon: <CloseOutlined /> },
  ARCHIVED:  { label: 'Đã lưu trữ',   color: 'default',    bg: 'rgba(100,116,139,0.08)', text: '#64748b', icon: <EyeInvisibleOutlined /> },
};

const CATEGORY_META = {
  'tu-sach':  { name: 'Tủ sách',  color: '#2563EB', bg: 'rgba(37,99,235,0.08)', icon: <BookOutlined /> },
  'tai-lieu': { name: 'Tài liệu', color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: <FileTextOutlined /> },
  'van-ban':  { name: 'Văn bản',  color: '#EA580C', bg: 'rgba(234,88,12,0.08)', icon: <FileWordOutlined /> },
  'ban-do':   { name: 'Bản đồ',   color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', icon: <PictureOutlined /> },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function LibraryManagement() {
  const { currentUser, currentRole } = useMock();
  const isLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);

  const [docs, setDocs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DOCS);
    if (saved) return JSON.parse(saved);
    return initialLibraryDocs.map((d, i) => ({
      ...d, adminStatus: i < 6 ? 'PUBLISHED' : i < 9 ? 'APPROVED' : 'PENDING',
      approvedBy: i < 9 ? 'Trần Văn A' : null, approvedAt: i < 9 ? '2026-07-15' : null,
      createdBy: 'Admin', createdAt: '2026-06-01', updatedAt: '2026-07-20',
      publishedAt: i < 6 ? '2026-07-20' : null,
      viewCount: Math.floor(Math.random() * 5000), rejectionReason: null,
    }));
  });

  const [laws, setLaws] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LAWS);
    if (saved) return JSON.parse(saved);
    return initialLawsData.map(l => ({ ...l, adminStatus: 'PUBLISHED', approvedBy: 'Quản trị viên', approvedAt: '2026-01-01' }));
  });

  const [activeTab, setActiveTab] = useState('documents');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form] = Form.useForm();

  React.useEffect(() => { localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs)); }, [docs]);
  React.useEffect(() => { localStorage.setItem(STORAGE_KEY_LAWS, JSON.stringify(laws)); }, [laws]);

  const allDocs = activeTab === 'documents' ? docs : laws;

  const kpiStats = useMemo(() => ({
    total: allDocs.length,
    published: allDocs.filter(d => d.adminStatus === 'PUBLISHED').length,
    approved: allDocs.filter(d => d.adminStatus === 'APPROVED').length,
    pending: allDocs.filter(d => d.adminStatus === 'PENDING' || d.adminStatus === 'DRAFT').length,
    rejected: allDocs.filter(d => d.adminStatus === 'REJECTED').length,
    totalViews: allDocs.reduce((s, d) => s + (d.viewCount || 0), 0),
    totalDownloads: allDocs.reduce((s, d) => s + (d.downloads || 0), 0),
  }), [allDocs]);

  const filteredData = useMemo(() => {
    return allDocs.filter(item => {
      const q = searchText.toLowerCase();
      const matchText = !searchText || item.title?.toLowerCase().includes(q) ||
        (item.author || item.issuingAgency || '').toLowerCase().includes(q) ||
        item.tags?.some(t => t.toLowerCase().includes(q)) || (item.code || '').toLowerCase().includes(q);
      const matchCat = !filterCategory || (activeTab === 'documents' ? item.category === filterCategory : item.type === filterCategory);
      const matchStatus = !filterStatus || item.adminStatus === filterStatus;
      return matchText && matchCat && matchStatus;
    });
  }, [allDocs, searchText, filterCategory, filterStatus]);

  // ---- Columns ----
  const columns = [
    {
      title: 'TÊN TÀI LIỆU', dataIndex: 'title', key: 'title', width: '30%',
      render: (text, record) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 mt-0.5 border border-gray-100">
            {record.cover ? <img src={record.cover} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileTextOutlined /></div>}
          </div>
          <div className="min-w-0">
            <div className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2">{text}</div>
            <div className="text-xs text-gray-400 mt-0.5">{record.author || record.issuingAgency || '—'}</div>
            {record.code && <div className="text-[10px] text-gray-400 font-mono mt-0.5">{record.code}</div>}
          </div>
        </div>
      ),
    },
    {
      title: 'DANH MỤC', dataIndex: 'category', key: 'category', width: 110,
      render: (cat) => {
        const m = CATEGORY_META[cat] || { name: cat, color: '#6B7280', bg: 'rgba(107,114,128,0.08)' };
        return <Tag className="rounded border-none px-2.5 py-0.5 font-medium text-[11px]" style={{ backgroundColor: m.bg, color: m.color }}>{m.name || '—'}</Tag>;
      },
    },
    {
      title: 'LOẠI', dataIndex: 'docType', key: 'docType', width: 90,
      render: (type, record) => <span className="text-xs text-gray-500">{type || record.type || '—'}</span>,
    },
    {
      title: 'LƯỢT XEM', dataIndex: 'viewCount', key: 'viewCount', width: 85, sorter: (a, b) => (a.viewCount || 0) - (b.viewCount || 0),
      render: v => <span className="text-xs text-gray-500"><EyeOutlined className="text-gray-400 mr-1" />{(v || 0).toLocaleString('vi-VN')}</span>,
    },
    {
      title: 'LƯỢT TẢI', dataIndex: 'downloads', key: 'downloads', width: 85, sorter: (a, b) => (a.downloads || 0) - (b.downloads || 0),
      render: v => <span className="text-xs text-gray-500"><DownloadOutlined className="text-gray-400 mr-1" />{(v || 0).toLocaleString('vi-VN')}</span>,
    },
    {
      title: 'TRẠNG THÁI', dataIndex: 'adminStatus', key: 'adminStatus', width: 120,
      render: (status) => {
        const s = STATUS_MAP[status] || STATUS_MAP.DRAFT;
        return <Tag className="rounded border-none px-2.5 py-0.5 font-semibold text-[11px]" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</Tag>;
      },
    },
    {
      title: 'NGƯỜI DUYỆT', dataIndex: 'approvedBy', key: 'approvedBy', width: 110,
      render: (approver) => approver
        ? <span className="text-xs text-gray-600"><CheckCircleOutlined className="text-green-500 mr-1 text-[10px]" />{approver}</span>
        : <span className="text-xs text-gray-400 italic">—</span>,
    },
    {
      title: '', key: 'action', width: 48,
      render: (_, record) => {
        const items = [
          { key: 'view', label: 'Xem chi tiết', icon: <EyeOutlined className="text-blue-600" />, onClick: () => { setSelectedItem(record); setIsDetailOpen(true); } },
          ...(isLeader ? [
            { type: 'divider' },
            { key: 'edit', label: 'Chỉnh sửa', icon: <EditOutlined className="text-indigo-600" />, onClick: () => openEditModal(record) },
            { key: 'status', label: 'Đổi trạng thái', icon: <SyncOutlined className="text-amber-500" />, children: [
              { key: 's-pending', label: '⏳ Chờ duyệt', onClick: () => updateStatus(record.id, 'PENDING') },
              { key: 's-approved', label: '✅ Đã duyệt', onClick: () => updateStatus(record.id, 'APPROVED') },
              { key: 's-published', label: '🚀 Xuất bản', onClick: () => updateStatus(record.id, 'PUBLISHED') },
              { key: 's-rejected', label: '❌ Từ chối', onClick: () => updateStatus(record.id, 'REJECTED') },
              { key: 's-archived', label: '📦 Lưu trữ', onClick: () => updateStatus(record.id, 'ARCHIVED') },
            ]},
            { type: 'divider' },
            { key: 'delete', label: 'Xóa tài liệu', icon: <DeleteOutlined />, danger: true, onClick: () => {
              Modal.confirm({
                title: 'Xác nhận xóa', icon: <ExclamationCircleOutlined />,
                content: `Xóa "${record.title}"? Hành động này không thể hoàn tác.`,
                okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
                onOk: () => {
                  if (activeTab === 'documents') setDocs(prev => prev.filter(d => d.id !== record.id));
                  else setLaws(prev => prev.filter(l => l.id !== record.id));
                  message.success('Đã xóa tài liệu!');
                },
              });
            }},
          ] : []),
        ];
        return <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight"><Button type="text" shape="circle" icon={<EllipsisOutlined className="text-gray-500" />} /></Dropdown>;
      },
    },
  ];

  // ---- Handlers ----
  const updateStatus = (id, newStatus) => {
    const updater = prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item, adminStatus: newStatus,
        approvedBy: ['APPROVED','PUBLISHED'].includes(newStatus) ? currentUser?.fullName || 'Lãnh đạo' : item.approvedBy,
        approvedAt: ['APPROVED','PUBLISHED'].includes(newStatus) ? new Date().toISOString().split('T')[0] : item.approvedAt,
        publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString().split('T')[0] : item.publishedAt,
        rejectionReason: newStatus === 'REJECTED' ? 'Không đạt yêu cầu kiểm duyệt' : null,
      };
    });
    if (activeTab === 'documents') setDocs(updater); else setLaws(updater);
    message.success(`Đã chuyển sang: ${STATUS_MAP[newStatus].label}`);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const { file, cover, tags, sections, chapters, ...rest } = values;
      const tagArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : (Array.isArray(tags) ? tags : []);

      // Parse sections
      const sectionsArray = (sections || []).map(s => ({ heading: s.heading || '', content: s.content || '' })).filter(s => s.heading || s.content);

      // Parse chapters: articles string -> array
      const chaptersArray = (chapters || []).map(ch => ({
        title: ch.title || '',
        articles: (ch.articles || '').split('\n').map(a => a.trim()).filter(Boolean),
      })).filter(ch => ch.title);

      let coverUrl = editingItem?.cover || '';
      if (cover && Array.isArray(cover) && cover.length > 0) {
        if (cover[0].originFileObj) coverUrl = URL.createObjectURL(cover[0].originFileObj);
        else if (cover[0].url) coverUrl = cover[0].url;
      }
      let fileName = editingItem?.fileName || '';
      if (file && Array.isArray(file) && file.length > 0) {
        if (file[0].originFileObj) fileName = file[0].name;
        else if (file[0].name) fileName = file[0].name;
      }

      if (editingItem) {
        const updater = prev => prev.map(item => item.id === editingItem.id ? {
          ...item, ...rest, tags: tagArray,
          sections: sectionsArray.length > 0 ? sectionsArray : item.sections,
          chapters: chaptersArray.length > 0 ? chaptersArray : item.chapters,
          cover: coverUrl || item.cover, fileName: fileName || item.fileName,
          author: rest.author || item.author || item.issuingAgency,
          docType: rest.docType || item.docType || item.type,
          description: rest.description || item.description || item.summary,
          updatedAt: new Date().toISOString().split('T')[0],
        } : item);
        if (activeTab === 'documents') setDocs(updater); else setLaws(updater);
        message.success('Đã cập nhật tài liệu!');
      } else {
        const newDoc = {
          ...rest, tags: tagArray,
          sections: sectionsArray, chapters: chaptersArray,
          id: `${activeTab === 'documents' ? 'doc' : 'law'}-${Date.now()}`,
          cover: coverUrl || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=400&fit=crop',
          fileName: fileName || 'document.pdf', fileSize: '1.5 MB',
          downloads: 0, viewCount: 0, featured: false, adminStatus: 'DRAFT',
          createdBy: currentUser?.fullName || 'Admin',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          approvedBy: null, approvedAt: null, publishedAt: null, rejectionReason: null,
        };
        if (activeTab === 'documents') setDocs(prev => [newDoc, ...prev]);
        else setLaws(prev => [newDoc, ...prev]);
        message.success('Đã tạo tài liệu mới!');
      }
      setIsModalOpen(false); setEditingItem(null); form.resetFields();
    }).catch(() => {});
  };

  const openCreateModal = () => {
    setEditingItem(null); form.resetFields();
    if (activeTab === 'documents') {
      form.setFieldsValue({ category: 'tai-lieu', docType: 'Tài liệu', featured: false, sections: [] });
    } else {
      form.setFieldsValue({ chapters: [] });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      id: record.id, title: record.title || '',
      author: record.author || record.issuingAgency || '',
      category: record.category || '', docType: record.docType || record.type || '',
      featured: record.featured || false,
      description: record.description || record.summary || '',
      tags: Array.isArray(record.tags) ? record.tags.join(', ') : (record.tags || ''),
      code: record.code || '', issuingAgency: record.issuingAgency || '',
      status: record.status || 'Đang hiệu lực',
      issuedDate: record.issuedDate || '', effectiveDate: record.effectiveDate || '',
      adminStatus: record.adminStatus || 'DRAFT',
      sections: record.sections || [],
      chapters: (record.chapters || []).map(ch => ({ ...ch, articles: (ch.articles || []).join('\n') })),
      cover: record.cover ? [{ uid: '-1', name: 'cover.jpg', status: 'done', url: record.cover, thumbUrl: record.cover }] : [],
      file: record.fileName ? [{ uid: '-2', name: record.fileName, status: 'done' }] : [],
    });
    setIsModalOpen(true);
  };

  const bulkApprove = () => {
    const pending = filteredData.filter(d => d.adminStatus === 'PENDING' || d.adminStatus === 'DRAFT');
    if (!pending.length) { message.info('Không có tài liệu nào cần duyệt.'); return; }
    Modal.confirm({
      title: 'Duyệt hàng loạt', icon: <CheckCircleOutlined />,
      content: `Duyệt ${pending.length} tài liệu đang chờ?`, okText: 'Duyệt tất cả', cancelText: 'Hủy',
      onOk: () => {
        const ids = new Set(pending.map(d => d.id));
        const updater = prev => prev.map(item => ids.has(item.id) ? { ...item, adminStatus: 'APPROVED', approvedBy: currentUser?.fullName || 'Lãnh đạo', approvedAt: new Date().toISOString().split('T')[0] } : item);
        if (activeTab === 'documents') setDocs(updater); else setLaws(updater);
        message.success(`Đã duyệt ${pending.length} tài liệu!`);
      },
    });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileTextOutlined className="text-gray-400 text-lg" />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FilePdfOutlined className="text-red-500 text-lg" />;
    if (['doc','docx'].includes(ext)) return <FileWordOutlined className="text-blue-500 text-lg" />;
    return <FileTextOutlined className="text-blue-600 text-lg" />;
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-4 md:space-y-6">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0 flex items-center gap-2">
            <BookOutlined className="text-blue-600" /> Quản lý Thư Viện Số
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Quản lý tài liệu địa phương và văn bản pháp luật hiển thị trên trang Thư Viện Số cho người dân.</p>
        </div>
        <Space>
          {isLeader && (
            <Dropdown menu={{
              items: [
                {
                  key: 'approve-all',
                  label: <span className="flex items-center gap-2"><CheckCircleOutlined className="text-blue-500" /> Duyệt tất cả đang chờ ({kpiStats.pending})</span>,
                  onClick: bulkApprove,
                  disabled: kpiStats.pending === 0,
                },
                {
                  key: 'publish-all',
                  label: <span className="flex items-center gap-2"><SendOutlined className="text-green-500" /> Xuất bản tất cả đã duyệt</span>,
                  onClick: () => {
                    const approved = allDocs.filter(d => d.adminStatus === 'APPROVED');
                    if (!approved.length) { message.info('Không có tài liệu đã duyệt nào.'); return; }
                    Modal.confirm({
                      title: 'Xuất bản hàng loạt', icon: <SendOutlined />,
                      content: `Xuất bản ${approved.length} tài liệu đã duyệt?`, okText: 'Xuất bản', cancelText: 'Hủy',
                      onOk: () => {
                        const ids = new Set(approved.map(d => d.id));
                        const updater = prev => prev.map(item => ids.has(item.id) ? { ...item, adminStatus: 'PUBLISHED', publishedAt: new Date().toISOString().split('T')[0] } : item);
                        if (activeTab === 'documents') setDocs(updater); else setLaws(updater);
                        message.success(`Đã xuất bản ${approved.length} tài liệu!`);
                      },
                    });
                  },
                },
                { type: 'divider' },
                {
                  key: 'reject-all',
                  label: <span className="flex items-center gap-2"><CloseOutlined className="text-red-500" /> Từ chối tất cả đang chờ</span>,
                  onClick: () => {
                    const pending = allDocs.filter(d => d.adminStatus === 'PENDING' || d.adminStatus === 'DRAFT');
                    if (!pending.length) { message.info('Không có tài liệu đang chờ nào.'); return; }
                    Modal.confirm({
                      title: 'Từ chối hàng loạt', icon: <ExclamationCircleOutlined />,
                      content: `Từ chối ${pending.length} tài liệu đang chờ?`, okText: 'Từ chối', okType: 'danger', cancelText: 'Hủy',
                      onOk: () => {
                        const ids = new Set(pending.map(d => d.id));
                        const updater = prev => prev.map(item => ids.has(item.id) ? { ...item, adminStatus: 'REJECTED', rejectionReason: 'Từ chối hàng loạt' } : item);
                        if (activeTab === 'documents') setDocs(updater); else setLaws(updater);
                        message.warning(`Đã từ chối ${pending.length} tài liệu!`);
                      },
                    });
                  },
                  disabled: kpiStats.pending === 0,
                },
              ]
            }} trigger={['click']} placement="bottomRight">
              <Button className="rounded-lg h-10 font-semibold border-2 border-blue-200 bg-blue-50 text-blue-700 hover:!bg-blue-100 hover:!border-blue-300 flex items-center gap-2 px-4">
                <CheckOutlined />
                Duyệt hàng loạt
                {kpiStats.pending > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                    {kpiStats.pending}
                  </span>
                )}
              </Button>
            </Dropdown>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}
            className="bg-blue-600 hover:!bg-blue-700 font-semibold rounded-lg px-4 h-10 flex items-center shadow-sm border-none">
            Thêm tài liệu
          </Button>
        </Space>
      </div>

      {/* ---- KPI Stats ---- */}
      <Row gutter={[12, 12]}>
        {[
          { label: 'Tổng tài liệu', val: kpiStats.total, icon: <FileTextOutlined />, color: 'blue' },
          { label: 'Đã xuất bản', val: kpiStats.published, icon: <GlobalOutlined />, color: 'emerald' },
          { label: 'Đã duyệt', val: kpiStats.approved, icon: <CheckCircleOutlined />, color: 'blue' },
          { label: 'Chờ duyệt', val: kpiStats.pending, icon: <ClockCircleOutlined />, color: 'amber' },
          { label: 'Từ chối', val: kpiStats.rejected, icon: <CloseOutlined />, color: 'red' },
          { label: 'Lượt xem', val: kpiStats.totalViews.toLocaleString('vi-VN'), icon: <EyeOutlined />, color: 'indigo' },
          { label: 'Lượt tải', val: kpiStats.totalDownloads.toLocaleString('vi-VN'), icon: <DownloadOutlined />, color: 'purple' },
        ].map((s, i) => (
          <Col xs={12} sm={8} md={6} lg={Math.floor(24/7)} key={i}>
            <Card className="shadow-sm border border-gray-200 rounded-lg" styles={{ body: { padding: '14px 16px' } }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">{s.label}</p>
                  <h3 className="text-xl font-bold text-gray-800 m-0">{s.val}</h3>
                </div>
                <div className={`bg-${s.color}-50 text-${s.color}-600 p-2.5 rounded-lg text-lg flex items-center`}>
                  {s.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ---- Tabs ---- */}
      <Tabs
        activeKey={activeTab}
        onChange={k => { setActiveTab(k); setSearchText(''); setFilterCategory(''); setFilterStatus(''); }}
        className="library-tabs"
        items={[
          { key: 'documents', label: <span className="flex items-center gap-1.5"><FileTextOutlined />Tài liệu địa phương<span className="text-gray-400 text-xs ml-1">({docs.length})</span></span> },
          { key: 'laws', label: <span className="flex items-center gap-1.5"><BookOutlined />Văn bản pháp luật<span className="text-gray-400 text-xs ml-1">({laws.length})</span></span> },
        ]}
      />

      {/* ---- Filter ---- */}
      <Card className="shadow-sm border border-gray-200 rounded-lg" styles={{ body: { padding: 16 } }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm theo tiêu đề, tác giả, tags..."
            value={searchText} onChange={e => setSearchText(e.target.value)}
            allowClear className="rounded-lg h-10 border-gray-300 w-full md:w-80"
          />
          <Space wrap>
            <Text className="text-xs font-bold text-gray-500 hidden sm:inline">Bộ lọc:</Text>
            {activeTab === 'documents' ? (
              <Select placeholder="Danh mục" value={filterCategory || undefined} onChange={setFilterCategory}
                style={{ width: 140 }} allowClear className="rounded-lg">
                {libraryCategories.map(cat => (
                  <Option key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />{cat.name}
                    </span>
                  </Option>
                ))}
              </Select>
            ) : (
              <Select placeholder="Loại văn bản" value={filterCategory || undefined} onChange={setFilterCategory}
                style={{ width: 150 }} allowClear className="rounded-lg">
                {['Hiến pháp','Bộ luật','Luật','Nghị định'].map(t => (
                  <Option key={t} value={t}>{t}</Option>
                ))}
              </Select>
            )}
            <Select placeholder="Trạng thái" value={filterStatus || undefined} onChange={setFilterStatus}
              style={{ width: 140 }} allowClear className="rounded-lg">
              {Object.entries(STATUS_MAP).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
            </Select>
            {(searchText || filterCategory || filterStatus) && (
              <Button type="text" danger onClick={() => { setSearchText(''); setFilterCategory(''); setFilterStatus(''); }}
                className="font-medium hover:bg-red-50 rounded-lg text-xs">Xóa bộ lọc</Button>
            )}
          </Space>
        </div>
      </Card>

      {/* ---- Table ---- */}
      <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns} dataSource={filteredData} rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `Tổng số ${t} tài liệu` }}
          onRow={(record) => ({ onDoubleClick: () => { setSelectedItem(record); setIsDetailOpen(true); } })}
          size="middle"
        />
      </Card>

      {/* ============================================ */}
      {/* CREATE / EDIT MODAL */}
      {/* ============================================ */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-900 pb-1 font-bold text-base">
            <BookOutlined className="text-blue-600" />
            {editingItem ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
          </div>
        }
        open={isModalOpen} onOk={handleSave}
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? 'Cập nhật' : 'Tạo mới'} cancelText="Hủy bỏ"
        width={760}
        okButtonProps={{ className: 'bg-blue-600 hover:!bg-blue-700 border-none rounded-lg h-9 font-semibold px-6' }}
        cancelButtonProps={{ className: 'rounded-lg h-9' }}
      >
        <Form form={form} layout="vertical" className="mt-3">
          <Form.Item name="id" hidden><Input /></Form.Item>

          {/* Section: Basic info */}
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />Thông tin cơ bản
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="title" label={<span className="font-semibold text-gray-700 text-xs">Tiêu đề tài liệu <span className="text-red-400">*</span></span>} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
              <Input placeholder="Nhập tiêu đề tài liệu..." className="rounded-lg h-9" />
            </Form.Item>
            <Form.Item name="author" label={<span className="font-semibold text-gray-700 text-xs">Tác giả / Cơ quan ban hành</span>}>
              <Input placeholder="Tác giả hoặc cơ quan ban hành..." className="rounded-lg h-9" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5">
            <Form.Item name="category" label={<span className="font-semibold text-gray-700 text-xs">Danh mục <span className="text-red-400">*</span></span>} rules={[{ required: true, message: 'Chọn danh mục!' }]}>
              <Select placeholder="Chọn danh mục" className="rounded-lg">
                {libraryCategories.map(cat => (
                  <Option key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />{cat.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="docType" label={<span className="font-semibold text-gray-700 text-xs">Loại tài liệu</span>}>
              <Select placeholder="Chọn loại" className="rounded-lg" allowClear>
                {['Sách','Báo cáo','Hướng dẫn','Đề án','Quyết định','Nghị quyết','Chỉ thị','Bản đồ quy hoạch','Bản đồ hành chính','Sơ đồ kỹ thuật'].map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="featured" label={<span className="font-semibold text-gray-700 text-xs">Nổi bật</span>} initialValue={false}>
              <Select className="rounded-lg">
                <Option value={false}>Không</Option>
                <Option value={true}>Có — Hiển thị ở trang chủ</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="description" label={<span className="font-semibold text-gray-700 text-xs">Mô tả / Tóm tắt <span className="text-red-400">*</span></span>} rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input.TextArea rows={3} placeholder="Nhập mô tả ngắn về tài liệu..." className="rounded-lg" />
          </Form.Item>

          <Form.Item name="tags" label={<span className="font-semibold text-gray-700 text-xs">Tags — phân cách bằng dấu phẩy</span>}>
            <Input placeholder="VD: lịch sử, địa phương, tăng nhơn phú" className="rounded-lg h-9" />
          </Form.Item>

          {/* Section: Cấu trúc nội dung */}
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 mt-1 flex items-center gap-1.5">
            <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />Cấu trúc nội dung
          </div>

          {activeTab === 'documents' ? (
            <Form.List name="sections">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map(({ key, name, ...rest }) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Phần {name + 1}</span>
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => remove(name)} className="text-[10px]" />
                      </div>
                      <Form.Item {...rest} name={[name, 'heading']} label={<span className="text-[10px] text-gray-500">Tiêu đề</span>} className="mb-2">
                        <Input placeholder="VD: Chương 1: Giới thiệu" className="rounded-lg h-8 text-xs" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'content']} label={<span className="text-[10px] text-gray-500">Nội dung</span>} className="mb-0">
                        <Input.TextArea rows={2} placeholder="Nhập nội dung..." className="rounded-lg text-xs" />
                      </Form.Item>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add({ heading: '', content: '' })} icon={<PlusOutlined />} block className="rounded-lg text-xs">
                    Thêm phần nội dung
                  </Button>
                </div>
              )}
            </Form.List>
          ) : (
            <Form.List name="chapters">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map(({ key, name, ...rest }) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Chương {name + 1}</span>
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => remove(name)} className="text-[10px]" />
                      </div>
                      <Form.Item {...rest} name={[name, 'title']} label={<span className="text-[10px] text-gray-500">Tiêu đề chương</span>} className="mb-2">
                        <Input placeholder="VD: Chương I: Những quy định chung" className="rounded-lg h-8 text-xs" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'articles']} label={<span className="text-[10px] text-gray-500">Danh sách điều khoản (mỗi dòng 1 điều)</span>} className="mb-0">
                        <Input.TextArea rows={3} placeholder="Điều 1: ...&#10;Điều 2: ...&#10;Điều 3: ..." className="rounded-lg text-xs" />
                      </Form.Item>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add({ title: '', articles: '' })} icon={<PlusOutlined />} block className="rounded-lg text-xs">
                    Thêm chương
                  </Button>
                </div>
              )}
            </Form.List>
          )}

          {/* Conditional: Legal info */}
          <Form.Item noStyle dependencies={['category']}>
            {({ getFieldValue }) => {
              if (getFieldValue('category') !== 'van-ban') return null;
              return (
                <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-200 mb-3">
                  <div className="text-xs font-bold text-orange-800 mb-3 flex items-center gap-1.5">
                    <span className="w-1 h-4 bg-orange-500 rounded-full inline-block" />Thông tin văn bản pháp lý
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5">
                    <Form.Item name="code" label={<span className="text-xs text-gray-600 font-medium">Số / Ký hiệu</span>}>
                      <Input placeholder="VD: Số 123/QĐ-UBND" className="rounded-lg h-8 text-xs" />
                    </Form.Item>
                    <Form.Item name="issuingAgency" label={<span className="text-xs text-gray-600 font-medium">Cơ quan ban hành</span>}>
                      <Input placeholder="VD: UBND Phường TNP" className="rounded-lg h-8 text-xs" />
                    </Form.Item>
                    <Form.Item name="status" label={<span className="text-xs text-gray-600 font-medium">Tình trạng hiệu lực</span>}>
                      <Select className="rounded-lg text-xs" defaultValue="Đang hiệu lực">
                        <Option value="Đang hiệu lực">Đang hiệu lực</Option>
                        <Option value="Hết hiệu lực">Hết hiệu lực</Option>
                        <Option value="Chưa có hiệu lực">Chưa có hiệu lực</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                    <Form.Item name="issuedDate" label={<span className="text-xs text-gray-600 font-medium">Ngày ban hành</span>}>
                      <Input placeholder="DD/MM/YYYY" className="rounded-lg h-8 text-xs" />
                    </Form.Item>
                    <Form.Item name="effectiveDate" label={<span className="text-xs text-gray-600 font-medium">Ngày có hiệu lực</span>}>
                      <Input placeholder="DD/MM/YYYY" className="rounded-lg h-8 text-xs" />
                    </Form.Item>
                  </div>
                </div>
              );
            }}
          </Form.Item>

          {/* Section: Files */}
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 mt-1 flex items-center gap-1.5">
            <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />File đính kèm & Ảnh bìa
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="cover" label={<span className="font-semibold text-gray-700 text-xs">Ảnh bìa tài liệu</span>}
              valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
              help={<span className="text-[10px] text-gray-400">Hỗ trợ JPG, PNG, WebP. Tỷ lệ khuyến nghị 3:2</span>}>
              <Upload maxCount={1} beforeUpload={() => false} accept="image/*" listType="picture-card">
                <div className="flex flex-col items-center text-gray-400"><PictureOutlined style={{ fontSize: 22 }} /><span className="text-[10px] mt-1">Tải ảnh bìa</span></div>
              </Upload>
            </Form.Item>
            <Form.Item name="file" label={<span className="font-semibold text-gray-700 text-xs">File tài liệu</span>}
              valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
              help={<span className="text-[10px] text-gray-400">Hỗ trợ PDF, DOCX, XLSX. Tối đa 25MB</span>}>
              <Upload maxCount={1} beforeUpload={() => false} className="file-upload">
                <Button icon={<UploadOutlined />} className="rounded-lg h-10 border-dashed border-2 w-full flex items-center justify-center text-sm">Chọn file tài liệu</Button>
              </Upload>
            </Form.Item>
          </div>

          {/* Status (edit + leader only) */}
          {editingItem && isLeader && (
            <>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 mt-1 flex items-center gap-1.5">
                <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />Trạng thái kiểm duyệt
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Form.Item name="adminStatus" label={<span className="font-semibold text-gray-700 text-xs">Trạng thái hiện tại</span>} className="mb-0">
                  <Select className="rounded-lg">
                    {Object.entries(STATUS_MAP).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                  </Select>
                </Form.Item>
              </div>
            </>
          )}

          {/* Info */}
          <div className="bg-blue-50/60 p-3 rounded-xl text-xs text-blue-800 flex items-start gap-2 border border-blue-100 mt-4">
            <GlobalOutlined className="text-blue-500 mt-0.5 shrink-0" />
            <div><span className="font-bold block mb-0.5">Lưu ý</span><span>Tài liệu sau khi được duyệt và xuất bản sẽ hiển thị công khai trên trang Thư Viện Số cho người dân tra cứu.</span></div>
          </div>
        </Form>
      </Modal>

      {/* ============================================ */}
      {/* DETAIL MODAL */}
      {/* ============================================ */}
      <Modal
        title={<div className="flex items-center gap-2 text-blue-900 pb-1 font-bold text-base"><EyeOutlined className="text-blue-600" />Chi tiết tài liệu</div>}
        open={isDetailOpen}
        onCancel={() => { setIsDetailOpen(false); setSelectedItem(null); }}
        footer={[
          <Button key="close" onClick={() => { setIsDetailOpen(false); setSelectedItem(null); }} className="rounded-lg h-9">Đóng</Button>,
          ...(isLeader && selectedItem ? [
            <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => { setIsDetailOpen(false); openEditModal(selectedItem); }}
              className="bg-blue-600 hover:!bg-blue-700 border-none rounded-lg h-9 font-semibold">Chỉnh sửa</Button>
          ] : []),
        ]}
        width={680}
      >
        {selectedItem && (
          <div className="space-y-5">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-white shadow-sm shrink-0 border border-gray-100">
                  {selectedItem.cover ? <img src={selectedItem.cover} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileTextOutlined style={{ fontSize: 28 }} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <Space size={4} className="mb-1.5">
                    {(() => {
                      const m = CATEGORY_META[selectedItem.category] || { name: selectedItem.category, color: '#6B7280', bg: 'rgba(107,114,128,0.08)' };
                      return <Tag className="rounded border-none text-[10px] font-semibold px-2 py-0.5" style={{ backgroundColor: m.bg, color: m.color }}>{m.name}</Tag>;
                    })()}
                    {(() => { const s = STATUS_MAP[selectedItem.adminStatus] || STATUS_MAP.DRAFT; return <Tag className="rounded border-none text-[10px] font-semibold px-2 py-0.5" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</Tag>; })()}
                    {selectedItem.featured && <Tag className="rounded border-none text-[10px] font-semibold px-2 py-0.5" color="gold">Nổi bật</Tag>}
                  </Space>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{selectedItem.title}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><UserOutlined className="text-gray-400" style={{ fontSize: 11 }} />{selectedItem.author || selectedItem.issuingAgency || '—'}</p>
                  {selectedItem.code && <p className="text-[10px] text-gray-400 font-mono mt-0.5">Số hiệu: {selectedItem.code}</p>}
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-blue-500 rounded-full inline-block" />Mô tả</div>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedItem.description || selectedItem.summary || 'Chưa có mô tả'}</p>
            </div>

            {/* Meta */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-blue-500 rounded-full inline-block" />Thông tin chi tiết</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2.5 text-xs bg-gray-50 p-3 rounded-lg">
                {[
                  ['Loại tài liệu', selectedItem.docType || selectedItem.type || '—'],
                  selectedItem.issuingAgency && ['Cơ quan ban hành', selectedItem.issuingAgency],
                  selectedItem.issuedDate && ['Ngày ban hành', selectedItem.issuedDate],
                  selectedItem.effectiveDate && ['Ngày hiệu lực', selectedItem.effectiveDate],
                  selectedItem.status && ['Tình trạng', selectedItem.status],
                  ['Lượt xem', (selectedItem.viewCount || 0).toLocaleString('vi-VN')],
                  ['Lượt tải', (selectedItem.downloads || 0).toLocaleString('vi-VN')],
                  ['Người tạo', selectedItem.createdBy || '—'],
                  ['Ngày tạo', selectedItem.createdAt || '—'],
                  ['Cập nhật cuối', selectedItem.updatedAt || '—'],
                  ['Người duyệt', selectedItem.approvedBy || <span className="text-gray-400 italic">Chưa duyệt</span>],
                  ['Ngày duyệt', selectedItem.approvedAt || '—'],
                  selectedItem.publishedAt && ['Ngày xuất bản', selectedItem.publishedAt],
                ].filter(Boolean).map(([label, val], i) => (
                  <div key={i}><span className="text-gray-400 block text-[10px]">{label}</span><span className={`font-medium text-gray-800 ${label === 'Tình trạng' && val === 'Đang hiệu lực' ? '!text-green-600' : ''}`}>{val}</span></div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-blue-500 rounded-full inline-block" />Tags</div>
                <div className="flex flex-wrap gap-1.5">{selectedItem.tags.map((tag, i) => <Tag key={i} className="rounded-full text-xs px-2.5 py-0.5 border-none bg-blue-50 text-blue-700">{tag}</Tag>)}</div>
              </div>
            )}

            {/* Sections/Chapters */}
            {(selectedItem.sections?.length > 0 || selectedItem.chapters?.length > 0) && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-blue-500 rounded-full inline-block" />Cấu trúc nội dung</div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  {selectedItem.sections?.map((s, i) => <div key={i} className="text-xs text-gray-700 pl-3 py-1 border-l-2 border-blue-300">{s.heading}</div>)}
                  {selectedItem.chapters?.map((ch, i) => <div key={i} className="text-xs text-gray-700 pl-3 py-1 border-l-2 border-orange-300">{ch.title} {ch.articles ? <span className="text-gray-400">({ch.articles.length} điều)</span> : ''}</div>)}
                </div>
              </div>
            )}

            {/* Rejection */}
            {selectedItem.adminStatus === 'REJECTED' && selectedItem.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1.5"><ExclamationCircleOutlined />Lý do từ chối</div>
                <p className="text-xs text-red-600">{selectedItem.rejectionReason}</p>
              </div>
            )}

            {/* File */}
            {selectedItem.fileName && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-blue-500 rounded-full inline-block" />File đính kèm</div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100">{getFileIcon(selectedItem.fileName)}</div>
                    <div><div className="text-xs font-semibold text-gray-800">{selectedItem.fileName}</div><div className="text-[10px] text-gray-400">{selectedItem.fileSize || 'N/A'}</div></div>
                  </div>
                  <Button type="primary" ghost size="small" icon={<DownloadOutlined />} className="rounded-lg border-blue-300 text-blue-600">Tải xuống</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style>{`
        .library-tabs .ant-tabs-nav { margin-bottom: 0 !important; }
        .library-tabs .ant-tabs-tab { padding: 10px 20px !important; font-weight: 500; }
        .library-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn { color: #2563eb !important; }
      `}</style>
    </div>
  );
}