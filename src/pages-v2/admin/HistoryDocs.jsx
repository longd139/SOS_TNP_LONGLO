import React, { useState, useMemo } from 'react';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Upload, message, Progress, Divider, Space, Avatar, Dropdown, DatePicker } from 'antd';
import { 
  PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, 
  RobotOutlined, FilePdfOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, FileWordOutlined, FileTextOutlined,
  SyncOutlined, SearchOutlined, EyeOutlined, DownloadOutlined,
  CloseOutlined, CloseCircleOutlined, EllipsisOutlined, GlobalOutlined, PictureOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';

const { Title } = Typography;
const { Option } = Select;

const historyDocsMock = [
  {
    id: 'HD001',
    docNumber: 'N/A',
    title: 'Lịch sử hình thành và phát triển Phường Tăng Nhơn Phú',
    relicName: 'UBND Phường Tăng Nhơn Phú',
    address: 'Số 10 Đường số 4, KP4, Tăng Nhơn Phú',
    subCategory: 'Lịch sử địa phương',
    issueDate: '2023-01-15',
    status: 'Đã duyệt',
    securityLevel: 'Công khai',
    fileName: 'Lich_su_TNP.pdf',
    fileSize: '8.2 MB',
    approver: 'Trần Văn A',
    aiLearned: true,
    isEditing: false,
    images: [
      { name: 'Di_Tich_1.jpg', url: 'https://images.unsplash.com/photo-1596422846543-75c6fc1f7f43?w=500&auto=format&fit=crop&q=60' }
    ],
    videos: [
      { name: 'Gioi_Thieu_Phuong_TNP.mp4', url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-mountains-with-a-river-in-4k-39744-large.mp4' }
    ]
  },
  {
    id: 'HD002',
    docNumber: '34/QĐ-UBND',
    title: 'Xếp hạng Di tích Lịch sử cấp Thành phố đối với Đình Tăng Nhơn Phú',
    relicName: 'Đình Tăng Nhơn Phú',
    address: 'Đường Tăng Nhơn Phú, KP3, Tăng Nhơn Phú',
    subCategory: 'Di tích lịch sử',
    issueDate: '2025-05-10',
    status: 'Chờ duyệt',
    securityLevel: 'Nội bộ',
    fileName: 'QuyetDinh_XepHang_DinhTNP.pdf',
    fileSize: '2.4 MB',
    approver: null,
    aiLearned: false,
    isEditing: false,
    images: []
  }
];

const HistoryDocs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [, setIsSyncingAI] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('historyDocsData_v2');
    return saved ? JSON.parse(saved) : historyDocsMock;
  });

  // Tìm kiếm & Lọc
  const [searchText, setSearchText] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterAI, setFilterAI] = useState('');
  const [filterSecurity, setFilterSecurity] = useState('');

  React.useEffect(() => {
    localStorage.setItem('historyDocsData_v2', JSON.stringify(data));
  }, [data]);

  const [form] = Form.useForm();
  const { currentRole, currentUser } = useMock();
  const isLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);

  const [subCategories, setSubCategories] = useState(() => {
    const saved = localStorage.getItem('historySubCategories_v2');
    return saved ? JSON.parse(saved) : ['Lịch sử địa phương', 'Di tích lịch sử', 'Văn hóa truyền thống'];
  });
  const [newSubCat, setNewSubCat] = useState('');

  React.useEffect(() => {
    localStorage.setItem('historySubCategories_v2', JSON.stringify(subCategories));
  }, [subCategories]);

  const addSubCategory = (e) => {
    e.preventDefault();
    if (newSubCat && !subCategories.includes(newSubCat)) {
      setSubCategories(prev => [...prev, newSubCat]);
      setNewSubCat('');
      message.success(`Đã thêm phân nhóm mới: "${newSubCat}"`);
    }
  };

  const deleteSubCategory = (catToDelete) => {
    if (subCategories.length <= 1) {
      message.warning('Phải giữ lại ít nhất 1 phân nhóm!');
      return;
    }
    setSubCategories(prev => prev.filter(cat => cat !== catToDelete));
    message.success(`Đã xóa phân nhóm: "${catToDelete}"`);
  };

  const addNotification = (title, messageText, targetRole) => {
    const savedNotifs = localStorage.getItem('notifications_v2');
    const notifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      message: messageText,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      role: targetRole
    };
    localStorage.setItem('notifications_v2', JSON.stringify([newNotif, ...notifs]));
    window.dispatchEvent(new Event('notifications_changed'));
  };

  // Tính toán KPI Stats
  const kpiStats = useMemo(() => {
    return {
      total: data.length,
      pending: data.filter(d => d.status === 'Chờ duyệt').length,
      approved: data.filter(d => d.status === 'Đã duyệt').length,
      aiTrained: data.filter(d => d.aiLearned).length
    };
  }, [data]);

  // Bộ lọc dữ liệu
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchText = !searchText || 
        item.title?.toLowerCase().includes(searchText.toLowerCase()) || 
        item.relicName?.toLowerCase().includes(searchText.toLowerCase());
      const matchSub = !filterSubCategory || item.subCategory === filterSubCategory;
      const matchStatus = !filterStatus || item.status === filterStatus;
      const matchDate = !filterDate || item.issueDate === filterDate;
      const matchAI = filterAI === '' || item.aiLearned === (filterAI === 'true');
      const matchSecurity = !filterSecurity || item.securityLevel === filterSecurity;
      return matchText && matchSub && matchStatus && matchDate && matchAI && matchSecurity;
    });
  }, [data, searchText, filterSubCategory, filterStatus, filterDate, filterAI, filterSecurity]);

  const handleOpenDrawer = (record) => {
    setSelectedDoc(record);
    setIsDrawerVisible(true);
  };

  // Giả lập nạp tri thức AI
  const handleSyncAI = (docId) => {
    setIsSyncingAI(true);
    message.loading({ content: 'Đang truyền nạp tri thức cho Trợ lý AI...', key: 'sync_ai' });
    
    setTimeout(() => {
      setData(prev => prev.map(item => 
        item.id === docId ? { ...item, aiLearned: true } : item
      ));
      if (selectedDoc && selectedDoc.id === docId) {
        setSelectedDoc(prev => ({ ...prev, aiLearned: true }));
      }
      setIsSyncingAI(false);
      message.success({ content: 'Trợ lý AI đã học xong tài liệu!', key: 'sync_ai', duration: 2 });
    }, 1500);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileTextOutlined className="text-gray-400 text-lg" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FilePdfOutlined className="text-red-500 text-lg" />;
    if (['doc', 'docx'].includes(ext)) return <FileWordOutlined className="text-blue-500 text-lg" />;
    return <FileTextOutlined className="text-blue-600 text-lg" />;
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text, record) => (
        <span className="text-gray-800 font-semibold leading-normal flex items-center gap-1.5 flex-wrap">
          {text}
          {record.isEditing && (
            <Tag color="orange" className="rounded font-medium border-none px-2 py-0 text-[10px] m-0">
              Đang chỉnh sửa
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: 'Di tích / Địa danh',
      dataIndex: 'relicName',
      key: 'relicName',
      render: (text) => <span className="text-blue-600 font-semibold">{text || 'N/A'}</span>
    },
    {
      title: 'Phân nhóm',
      dataIndex: 'subCategory',
      key: 'subCategory',
      render: (subCategory) => {
        let color = 'purple';
        if (subCategory === 'Di tích lịch sử') color = 'magenta';
        if (subCategory === 'Văn hóa truyền thống') color = 'orange';
        return (
          <Tag color={color} className="rounded font-medium border-none px-2.5 py-0.5 text-xs">
            {subCategory}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => <span className="text-gray-600 text-sm font-medium">{date}</span>
    },
    {
      title: 'Phạm vi',
      dataIndex: 'securityLevel',
      key: 'securityLevel',
      render: (level) => {
        let color = level === 'Công khai' ? 'green' : 'blue';
        return (
          <Tag color={color} className="rounded font-bold border-none px-2.5 py-0.5 text-xs">
            {level || 'Nội bộ'}
          </Tag>
        );
      }
    },
    {
      title: 'Trợ lý AI',
      dataIndex: 'aiLearned',
      key: 'aiLearned',
      render: (learned) => (
        <Tag 
          color={learned ? 'blue' : 'default'} 
          className="rounded font-medium m-0 flex items-center gap-1 border-none bg-opacity-10 px-2.5 py-0.5"
          style={{ 
            backgroundColor: learned ? 'rgba(37, 99, 235, 0.08)' : 'rgba(100, 116, 139, 0.08)',
            color: learned ? '#2563eb' : '#475569'
          }}
        >
          <RobotOutlined /> {learned ? 'Đã học' : 'Chưa học'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let bg = 'rgba(100, 116, 139, 0.08)';
        let text = '#475569';

        if (status === 'Đã duyệt') {
          color = 'success';
          bg = 'rgba(37, 99, 235, 0.08)';
          text = '#2563eb';
        } else if (status === 'Chờ duyệt') {
          color = 'warning';
          bg = 'rgba(245, 158, 11, 0.08)';
          text = '#b45309';
        } else if (status === 'Đã thu hồi') {
          color = 'error';
          bg = 'rgba(239, 68, 68, 0.08)';
          text = '#b91c1c';
        }

        return (
          <Tag 
            color={color} 
            className="rounded border-none px-2.5 py-0.5 font-semibold text-xs animate-fade-in"
            style={{ backgroundColor: bg, color: text }}
          >
            {status || 'Chờ duyệt'}
          </Tag>
        );
      }
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approver',
      key: 'approver',
      render: (approver, record) => {
        return approver || record.status === 'Đã duyệt' ? (
          <span className="font-semibold text-gray-700 text-sm">{approver || 'Lãnh đạo'}</span>
        ) : (
          <span className="text-gray-400 italic text-sm">Chờ duyệt</span>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'detail',
            label: 'Xem chi tiết',
            icon: <EyeOutlined className="text-blue-600" />,
            onClick: () => handleOpenDrawer(record)
          },
          {
            key: 'edit',
            label: record.isEditing && !isLeader ? 'Đang chỉnh sửa (Khóa)' : 'Chỉnh sửa tài liệu',
            icon: <EditOutlined className={record.isEditing && !isLeader ? "text-gray-400" : "text-indigo-600"} />,
            disabled: record.isEditing && !isLeader,
            onClick: () => {
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }
          },
          ...(isLeader ? [
            ...(record.status === 'Chờ duyệt' ? [{
              key: 'approve-doc',
              label: 'Duyệt tài liệu',
              icon: <CheckCircleOutlined className="text-emerald-600" />,
              onClick: () => {
                const updatedItem = { ...record, status: 'Đã duyệt', isEditing: false, approver: currentUser?.fullName || 'Lãnh đạo' };
                setData(prev => prev.map(item => item.id === record.id ? updatedItem : item));
                message.success('Đã duyệt tài liệu thành công!');
                addNotification('Tài liệu đã được duyệt', `Tài liệu Lịch sử "${record.title}" đã được Lãnh đạo phê duyệt thành công.`, 'OFFICER');
              }
            }] : []),
            ...(record.status === 'Đã duyệt' ? [{
              key: 'revoke-doc',
              label: 'Thu hồi tài liệu',
              icon: <CloseCircleOutlined className="text-red-600" />,
              onClick: () => {
                setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã thu hồi', isEditing: false, aiLearned: false, approver: null } : item));
                message.warning('Đã thu hồi tài liệu thành công!');
                addNotification('Tài liệu đã bị thu hồi', `Tài liệu Lịch sử "${record.title}" đã bị Lãnh đạo thu hồi.`, 'OFFICER');
              }
            }] : []),
            ...(record.status === 'Đã thu hồi' ? [{
              key: 'restore-doc',
              label: 'Chuyển thành Chờ duyệt',
              icon: <SyncOutlined className="text-amber-500" />,
              onClick: () => {
                setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Chờ duyệt', isEditing: false, aiLearned: false, approver: null } : item));
                message.info('Đã chuyển trạng thái sang Chờ duyệt');
                addNotification('Yêu cầu duyệt tài liệu', `Tài liệu Lịch sử "${record.title}" đã được đưa về trạng thái chờ duyệt.`, 'LEADER');
              }
            }] : []),
            ...(record.status === 'Đã duyệt' ? [{
              key: 'sync-ai',
              label: record.aiLearned ? 'Cập nhật tri thức cho Trợ lý AI' : 'Nạp tri thức cho Trợ lý AI',
              icon: <RobotOutlined className="text-blue-600" />,
              onClick: () => handleSyncAI(record.id)
            }] : []),
            ...(record.status === 'Đã duyệt' && record.securityLevel === 'Nội bộ' ? [{
              key: 'make-public',
              label: 'Chuyển sang công khai',
              icon: <GlobalOutlined className="text-emerald-600" />,
              onClick: () => {
                setData(prev => prev.map(item => item.id === record.id ? { ...item, securityLevel: 'Công khai' } : item));
                message.success('Đã chuyển tài liệu sang mức bảo mật Công khai!');
                addNotification('Tài liệu chuyển sang Công khai', `Tài liệu Lịch sử "${record.title}" đã được chuyển sang phạm vi Công khai.`, 'OFFICER');
              }
            }] : []),
            {
              type: 'divider'
            },
            {
              key: 'delete',
              label: 'Xóa tài liệu',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                setData(prev => prev.filter(item => item.id !== record.id));
                message.success('Đã xóa tài liệu');
              }
            }
          ] : [])
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button 
              type="text" 
              shape="circle" 
              icon={<EllipsisOutlined className="text-gray-600 text-lg" />} 
            />
          </Dropdown>
        );
      },
    },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      const isEdit = !!values.id;
      const { file, images, videos, ...restValues } = values;
      
      let uploadedFileName = `${values.title}.pdf`; 
      let fileUrl = null;
      let uploadedImages = [];
      let uploadedVideos = [];
      
      if (file && file.length > 0) {
        uploadedFileName = file[0].name;
        if (file[0].originFileObj) {
          fileUrl = URL.createObjectURL(file[0].originFileObj);
        }
      }

      if (images && images.length > 0) {
        uploadedImages = images.map(img => ({
          name: img.name,
          url: img.originFileObj ? URL.createObjectURL(img.originFileObj) : null
        })).filter(img => img.url);
      }

      if (videos && videos.length > 0) {
        uploadedVideos = videos.map(vid => ({
          name: vid.name,
          url: vid.originFileObj ? URL.createObjectURL(vid.originFileObj) : null
        })).filter(vid => vid.url);
      }

      if (isEdit) {
        const isUserLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);
        setData(prev => prev.map(item => item.id === values.id ? { 
          ...item, 
          ...restValues, 
          fileName: uploadedFileName, 
          fileUrl: fileUrl || item.fileUrl,
          images: uploadedImages.length > 0 ? uploadedImages : item.images,
          videos: uploadedVideos.length > 0 ? uploadedVideos : item.videos,
          status: isUserLeader ? item.status : 'Chờ duyệt',
          approver: isUserLeader ? item.approver : null,
          aiLearned: isUserLeader ? item.aiLearned : false,
          isEditing: isUserLeader ? item.isEditing : true
        } : item));
        if (!isUserLeader) {
          message.success('Đã lưu chỉnh sửa tài liệu và chuyển thành trạng thái Chờ duyệt!');
          addNotification('Yêu cầu duyệt chỉnh sửa', `Cán bộ ${currentUser?.fullName || ''} đã chỉnh sửa tài liệu Lịch sử "${values.title}" và đang chờ duyệt lại.`, 'LEADER');
        } else {
          message.success('Đã cập nhật tài liệu!');
        }
      } else {
        const newDoc = {
          ...restValues,
          fileName: uploadedFileName,
          fileUrl: fileUrl,
          images: uploadedImages,
          videos: uploadedVideos,
          id: `HD00${data.length + 1}`,
          status: 'Chờ duyệt',
          aiLearned: false,
          fileSize: '1.5 MB',
          isEditing: false
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Tải lên tài liệu văn hóa lịch sử thành công!');
        if (!isLeader) {
          addNotification('Yêu cầu duyệt tài liệu mới', `Cán bộ ${currentUser?.fullName || ''} đã tải lên tài liệu Lịch sử mới "${values.title}" và đang chờ duyệt.`, 'LEADER');
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <Title level={4} className="text-blue-900 font-bold m-0 flex items-center gap-2">
            <GlobalOutlined className="text-blue-600" />
            <span>Tài liệu Văn hóa & Lịch sử</span>
          </Title>
          <p className="text-xs md:text-sm text-gray-500 mt-1 m-0">Quản lý các tài liệu, hồ sơ địa danh và di tích lịch sử phường Tăng Nhơn Phú.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            form.resetFields();
            setIsModalVisible(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg px-4 h-10 flex items-center shadow-sm"
        >
          Tải tài liệu mới
        </Button>
      </div>

      {/* Grid Stats KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm rounded-lg border border-gray-200 p-4" styles={{ body: { padding: 0 } }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Tổng tài liệu</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 m-0">{kpiStats.total}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg text-lg flex items-center">
              <FileTextOutlined />
            </div>
          </div>
        </Card>
        
        <Card className="shadow-sm rounded-lg border border-gray-200 p-4" styles={{ body: { padding: 0 } }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Chờ duyệt</p>
              <h3 className="text-xl md:text-2xl font-bold text-amber-600 m-0">{kpiStats.pending}</h3>
            </div>
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg text-lg flex items-center">
              <ClockCircleOutlined />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm rounded-lg border border-gray-200 p-4" styles={{ body: { padding: 0 } }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Đã duyệt</p>
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 m-0">{kpiStats.approved}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg text-lg flex items-center">
              <CheckCircleOutlined />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm rounded-lg border border-gray-200 p-4" styles={{ body: { padding: 0 } }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">AI Đã Học</p>
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 m-0">{kpiStats.aiTrained}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg text-lg flex items-center">
              <RobotOutlined />
            </div>
          </div>
        </Card>
      </div>

      {/* Bộ Lọc & Tìm kiếm */}
      <Card className="shadow-sm border border-gray-200 rounded-lg" styles={{ body: { padding: 16 } }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <Input 
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm kiếm theo tiêu đề, địa danh..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              className="rounded-lg h-10 border-gray-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-gray-500 hidden sm:inline">Bộ lọc:</span>
            <Select 
              placeholder="Phân nhóm"
              value={filterSubCategory || undefined}
              onChange={setFilterSubCategory}
              style={{ width: 160 }}
              allowClear
              className="rounded-lg"
            >
              {subCategories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>

            <DatePicker 
              placeholder="Ngày ban hành" 
              onChange={(date, dateString) => setFilterDate(dateString)} 
              className="rounded-lg" 
              style={{ width: 140 }}
            />

            <Select 
              placeholder="Trợ lý AI"
              value={filterAI || undefined}
              onChange={setFilterAI}
              style={{ width: 120 }}
              allowClear
              className="rounded-lg"
            >
              <Option value="true">Đã học</Option>
              <Option value="false">Chưa học</Option>
            </Select>

            <Select 
              placeholder="Phạm vi"
              value={filterSecurity || undefined}
              onChange={setFilterSecurity}
              style={{ width: 120 }}
              allowClear
              className="rounded-lg"
            >
              <Option value="Nội bộ">Nội bộ</Option>
              <Option value="Công khai">Công khai</Option>
            </Select>

            <Select 
              placeholder="Trạng thái"
              value={filterStatus || undefined}
              onChange={setFilterStatus}
              style={{ width: 120 }}
              allowClear
              className="rounded-lg"
            >
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đã thu hồi">Đã thu hồi</Option>
            </Select>
            
            {(searchText || filterSubCategory || filterStatus || filterDate || filterAI || filterSecurity) && (
              <Button 
                type="text" 
                danger
                onClick={() => {
                  setSearchText('');
                  setFilterSubCategory('');
                  setFilterStatus('');
                  setFilterDate('');
                  setFilterAI('');
                  setFilterSecurity('');
                }}
                className="font-medium hover:bg-red-50 rounded-lg text-xs"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Bảng dữ liệu chính */}
      <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 8, className: 'px-4' }}
        />
      </Card>

      {/* Modal Upload & Chỉnh sửa */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-900 border-b pb-3 mb-2 font-bold text-base">
            <FileTextOutlined className="text-blue-600" />
            <span>{form.getFieldValue('id') ? "Cập nhật thông tin tài liệu" : "Tải lên tài liệu Văn hóa & Lịch sử"}</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        width={680}
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 border-none rounded-lg h-9 font-semibold' }}
        cancelButtonProps={{ className: 'rounded-lg h-9' }}
      >
        <Form form={form} layout="vertical" className="mt-2">
          <Form.Item name="id" hidden><Input /></Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item 
              name="relicName" 
              label={<span className="font-semibold text-gray-700 text-xs">Tên Di tích / Địa danh</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tên địa danh!' }]}
            >
              <Input placeholder="VD: UBND Phường Tăng Nhơn Phú" className="rounded-lg h-9" />
            </Form.Item>

            <Form.Item 
              name="issueDate" 
              label={<span className="font-semibold text-gray-700 text-xs">Ngày ban hành</span>} 
              rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}
              initialValue={new Date().toISOString().split('T')[0]}
            >
              <Input type="date" className="rounded-lg h-9" />
            </Form.Item>
          </div>

          <Form.Item 
            name="title" 
            label={<span className="font-semibold text-gray-700 text-xs">Tên tài liệu / Tiêu đề hồ sơ</span>} 
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tài liệu!' }]}
          >
            <Input.TextArea rows={2} placeholder="VD: Lịch sử hình thành và phát triển Phường..." className="rounded-lg" />
          </Form.Item>

          <Form.Item 
            name="address" 
            label={<span className="font-semibold text-gray-700 text-xs">Địa chỉ / Vị trí di tích</span>}
          >
            <Input placeholder="VD: Số 10 Đường số 4, KP4, Tăng Nhơn Phú" className="rounded-lg h-9" />
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item 
              name="subCategory" 
              label={<span className="font-semibold text-gray-700 text-xs">Phân nhóm</span>} 
              rules={[{ required: true, message: 'Vui lòng chọn phân nhóm!' }]}
            >
              <Select 
                placeholder="Chọn phân nhóm" 
                className="h-9 rounded-lg"
                optionLabelProp="label"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    {isLeader && (
                      <>
                        <Divider style={{ margin: '8px 0' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Input
                            placeholder="Thêm phân nhóm..."
                            value={newSubCat}
                            onChange={(e) => setNewSubCat(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="rounded h-8"
                          />
                          <Button type="text" icon={<PlusOutlined />} onClick={addSubCategory} className="text-blue-600 font-bold h-8">
                            Thêm
                          </Button>
                        </Space>
                      </>
                    )}
                  </>
                )}
              >
                {subCategories.map(cat => (
                  <Option key={cat} value={cat} label={cat}>
                    <div className="flex items-center justify-between w-full">
                      <span>{cat}</span>
                      {isLeader && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<CloseOutlined className="text-gray-400 hover:text-red-500 text-[10px]" />} 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubCategory(cat);
                          }}
                          className="flex items-center justify-center p-0 h-5 w-5 rounded-full hover:bg-gray-100"
                        />
                      )}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              name="securityLevel" 
              label={<span className="font-semibold text-gray-700 text-xs">Phạm vi truy cập</span>} 
              rules={[{ required: true }]} 
              initialValue="Nội bộ"
            >
              <Select placeholder="Chọn phạm vi" className="h-9 rounded-lg">
                <Option value="Nội bộ">Nội bộ (Xem nội bộ)</Option>
                <Option value="Công khai">Công khai (Người dân xem)</Option>
              </Select>
            </Form.Item>
          </div>
          
          <Divider className="my-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <Form.Item 
              name="file" 
              label={<span className="font-semibold text-gray-700 text-xs">File đính kèm (PDF, DOCX)</span>} 
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              rules={[{ required: !form.getFieldValue('id'), message: 'Vui lòng đính kèm file tài liệu!' }]}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />} className="flex items-center rounded-lg h-9 border-dashed w-full justify-center text-xs">
                  Chọn File PDF/DOCX
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item 
              name="images" 
              label={<span className="font-semibold text-gray-700 text-xs">Ảnh đính kèm / Phụ lục</span>} 
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload multiple beforeUpload={() => false} listType="picture">
                <Button icon={<PictureOutlined />} className="flex items-center rounded-lg h-9 border-dashed w-full justify-center text-xs">
                  Tải ảnh lên
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item 
              name="videos" 
              label={<span className="font-semibold text-gray-700 text-xs">Video đính kèm / Phụ lục</span>} 
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload multiple beforeUpload={() => false} listType="picture">
                <Button icon={<VideoCameraOutlined />} className="flex items-center rounded-lg h-9 border-dashed w-full justify-center text-xs">
                  Tải video lên
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Modal Xem chi tiết (Read-only) */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-900 border-b pb-3 mb-2 font-bold text-base">
            <EyeOutlined className="text-blue-600" />
            <span>Chi tiết hồ sơ di tích & AI</span>
          </div>
        }
        open={isDrawerVisible}
        onCancel={() => setIsDrawerVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDrawerVisible(false)} className="bg-blue-600 hover:bg-blue-700 rounded-lg">
            Đóng lại
          </Button>
        ]}
        width={580}
      >
        {selectedDoc && (
          <div className="space-y-5">
            {/* Header */}
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block">
                {selectedDoc.subCategory}
              </span>
              <h3 className="text-sm font-bold text-slate-800 leading-normal m-0">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-2 mb-0 flex items-center gap-2">
                <span>Mã số: #{selectedDoc.id}</span>
                <span>•</span>
                <span>Ngày ban hành: {selectedDoc.issueDate}</span>
              </p>
            </div>

            {/* Chi tiết */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                Thông tin hồ sơ di tích
              </h4>
              
              <div className="grid grid-cols-3 gap-y-2.5 text-xs">
                <span className="text-gray-500">Tên Di tích / Địa danh:</span>
                <span className="col-span-2 font-bold text-blue-600">{selectedDoc.relicName || 'N/A'}</span>

                <span className="text-gray-500">Địa chỉ di tích:</span>
                <span className="col-span-2 text-slate-700 font-semibold">{selectedDoc.address || 'N/A'}</span>

                <span className="text-gray-500">Người duyệt:</span>
                <span className="col-span-2 text-slate-700 font-semibold">
                  {selectedDoc.approver || <span className="text-gray-400 font-normal italic">Chưa phê duyệt</span>}
                </span>

                <span className="text-gray-500">Phạm vi truy cập:</span>
                <span className="col-span-2">
                  <Tag color={selectedDoc.securityLevel === 'Công khai' ? 'green' : 'blue'} className="rounded m-0 text-[10px] font-bold">
                    {selectedDoc.securityLevel === 'Công khai' ? 'Công khai (Người dân xem)' : 'Nội bộ (Xem nội bộ)'}
                  </Tag>
                </span>

                <span className="text-gray-500">Trạng thái duyệt:</span>
                <span className="col-span-2">
                  <Tag color={selectedDoc.status === 'Đã duyệt' ? 'success' : selectedDoc.status === 'Đã thu hồi' ? 'error' : 'warning'} className="rounded m-0 text-[10px] font-bold">
                    {selectedDoc.status || 'Chờ duyệt'}
                  </Tag>
                </span>
              </div>
            </div>

            {/* Tri thức Trợ lý AI */}
            <Card className="rounded-lg border border-blue-100 bg-blue-50/10 p-3" styles={{ body: { padding: 0 } }}>
              <div className="flex items-start gap-3">
                <Avatar icon={<RobotOutlined />} size={36} className="bg-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-blue-950 mb-0.5 m-0">Tri thức Trợ lý AI</h4>
                  <p className="text-[10px] text-gray-500 mb-2">Đào tạo kiến thức cho Trợ lý AI</p>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Progress 
                      type="circle" 
                      percent={selectedDoc.aiLearned ? 100 : 0} 
                      size={44} 
                      strokeColor="#2563eb"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">
                        {selectedDoc.aiLearned ? 'Đã học hoàn tất' : 'Chờ nạp tri thức'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {selectedDoc.aiLearned ? 'AI đã có tri thức' : 'AI chưa được nạp tri thức tài liệu này'}
                      </div>
                    </div>
                  </div>

                  {selectedDoc.status === 'Đã duyệt' && !selectedDoc.aiLearned && (
                    <div className="bg-blue-50 p-2 rounded border border-blue-100 text-[10px] text-blue-800">
                      Lãnh đạo thực hiện nạp tri thức từ menu Hành động ngoài danh sách để dạy AI.
                    </div>
                  )}
                  {selectedDoc.status === 'Chờ duyệt' && (
                    <div className="bg-amber-50 p-2 rounded border border-amber-100 text-[10px] text-amber-800">
                      Tài liệu cần được duyệt trước khi nạp tri thức cho AI.
                    </div>
                  )}
                  {selectedDoc.status === 'Đã thu hồi' && (
                    <div className="bg-red-50 p-2 rounded border border-red-100 text-[10px] text-red-800">
                      Tài liệu bị thu hồi, Trợ lý AI đã bị xóa tri thức của tài liệu này.
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Ảnh phụ lục */}
            {selectedDoc.images && selectedDoc.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                  Ảnh phụ lục / Hình ảnh di tích
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDoc.images.map((img, idx) => (
                    <div key={idx} className="aspect-video relative rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video phụ lục */}
            {selectedDoc.videos && selectedDoc.videos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                  Video tư liệu / Phụ lục
                </h4>
                <div className="space-y-2">
                  {selectedDoc.videos.map((vid, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 bg-black aspect-video">
                      <video src={vid.url} controls className="w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File đính kèm */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                Văn bản đính kèm
              </h4>
              
              {selectedDoc.fileName ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0">{getFileIcon(selectedDoc.fileName)}</div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate" title={selectedDoc.fileName}>
                        {selectedDoc.fileName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{selectedDoc.fileSize || 'N/A'} • PDF bản gốc</div>
                    </div>
                  </div>
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />} 
                    className="text-gray-500 hover:text-blue-600 flex-shrink-0"
                    onClick={() => {
                      if (selectedDoc.fileUrl) {
                        const link = document.createElement('a');
                        link.href = selectedDoc.fileUrl;
                        link.download = selectedDoc.fileName;
                        link.click();
                      } else {
                        message.info('Tải tệp giả lập thành công!');
                      }
                    }}
                  />
                </div>
              ) : (
                <span className="text-gray-400 italic text-xs">Không có file đính kèm</span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryDocs;
