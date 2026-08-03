import React, { useState, useMemo } from 'react';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Upload, message, Tooltip, Drawer, Descriptions, Progress, Divider, Space, Avatar, Badge, Dropdown } from 'antd';
import { 
  PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, 
  RobotOutlined, FilePdfOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, FileWordOutlined, FileTextOutlined,
  SyncOutlined, SearchOutlined, EyeOutlined, DownloadOutlined,
  LockOutlined, CheckOutlined, CloseOutlined, EllipsisOutlined, GlobalOutlined
} from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const internalDocsMock = [
  { 
    id: 'ID000', 
    docNumber: '45/BC-UBND', 
    title: 'Báo cáo tổng kết công tác tháng 7', 
    docType: 'Báo cáo', 
    securityLevel: 'Nội bộ', 
    department: 'Lãnh đạo UBND', 
    uploadDate: '2026-07-27', 
    aiLearned: false, 
    status: 'Chờ duyệt',
    fileName: 'Bao_cao_T7.docx',
    fileSize: '1.2 MB',
    approver: null
  },
  {
    id: 'ID001',
    docNumber: '15/KH-UBND',
    title: 'Kế hoạch triển khai công tác Cải cách hành chính năm 2026',
    docType: 'Kế hoạch',
    securityLevel: 'Nội bộ',
    department: 'Tất cả phòng ban',
    uploadDate: '2026-07-26',
    aiLearned: true,
    status: 'Đã duyệt',
    fileName: 'Ke_hoach_CCHC_2026.pdf',
    fileSize: '4.5 MB',
    approver: 'Trần Văn A'
  },
  {
    id: 'ID002',
    docNumber: '08/QĐ-UBND',
    title: 'Quyết định bổ nhiệm Cán bộ phụ trách Bộ phận một cửa',
    docType: 'Chỉ đạo điều hành',
    securityLevel: 'Mật',
    department: 'Văn phòng Đảng uỷ, Lãnh đạo UBND',
    uploadDate: '2026-07-25',
    aiLearned: true,
    status: 'Đã duyệt',
    fileName: 'QuyetDinh_BoNhiem.pdf',
    fileSize: '850 KB',
    approver: 'Trần Văn A'
  }
];

const InternalDocs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSyncingAI, setIsSyncingAI] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('internalDocsData_v2');
    return saved ? JSON.parse(saved) : internalDocsMock;
  });

  // Tìm kiếm & Lọc
  const [searchText, setSearchText] = useState('');
  const [filterDocType, setFilterDocType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  React.useEffect(() => {
    localStorage.setItem('internalDocsData_v2', JSON.stringify(data));
  }, [data]);

  const [form] = Form.useForm();
  const { currentRole, currentUser } = useMock();

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
        item.docNumber?.toLowerCase().includes(searchText.toLowerCase());
      const matchType = !filterDocType || item.docType === filterDocType;
      const matchStatus = !filterStatus || item.status === filterStatus;
      return matchText && matchType && matchStatus;
    });
  }, [data, searchText, filterDocType, filterStatus]);

  const handleOpenDrawer = (record) => {
    setSelectedDoc(record);
    setIsDrawerVisible(true);
  };

  // Giả lập đồng bộ AI
  const handleSyncAI = (docId) => {
    setIsSyncingAI(true);
    message.loading({ content: 'Đang nạp dữ liệu vào Vector Database...', key: 'sync_ai' });
    
    setTimeout(() => {
      setData(prev => prev.map(item => 
        item.id === docId ? { ...item, aiLearned: true } : item
      ));
      if (selectedDoc && selectedDoc.id === docId) {
        setSelectedDoc(prev => ({ ...prev, aiLearned: true }));
      }
      setIsSyncingAI(false);
      message.success({ content: 'Đồng bộ AI thành công!', key: 'sync_ai', duration: 2 });
    }, 1500);
  };

  const handleCopyToPublic = (record) => {
    // Lấy dữ liệu công khai hiện tại từ localStorage
    const savedPublic = localStorage.getItem('publicDocsData_v2');
    const publicData = savedPublic ? JSON.parse(savedPublic) : [];
    
    // Kiểm tra xem tài liệu này đã được công khai chưa
    const exists = publicData.some(item => item.title === record.title && item.docNumber === record.docNumber);
    if (exists) {
      message.warning('Tài liệu này đã tồn tại bên danh mục tài liệu Công khai!');
      return;
    }
    
    // Tạo bản ghi mới cho tài liệu công khai (Trạng thái: Chờ kiểm duyệt)
    const newPublicDoc = {
      id: `PD_AUTO_${Date.now()}`,
      category: 'Thủ tục hành chính', // Phân loại mặc định
      docNumber: record.docNumber || 'N/A',
      title: record.title,
      issueDate: record.uploadDate || new Date().toISOString().split('T')[0],
      status: 'Chờ kiểm duyệt', // Lãnh đạo cần duyệt xuất bản ở trang công khai
      fileName: record.fileName || 'document.pdf',
      fileSize: record.fileSize || '1.5 MB',
      fileUrl: record.fileUrl || null,
      images: record.images || [],
      approver: null
    };
    
    const updatedPublic = [newPublicDoc, ...publicData];
    localStorage.setItem('publicDocsData_v2', JSON.stringify(updatedPublic));
    message.success('Đã chuyển tài liệu sang danh mục Công khai (Trạng thái: Chờ kiểm duyệt)!');
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
      width: '40%',
      render: (text) => (
        <span className="text-gray-800 font-semibold leading-normal">
          {text}
        </span>
      ),
    },
    {
      title: 'Độ mật & Truy cập',
      dataIndex: 'securityLevel',
      key: 'securityLevel',
      render: (security, record) => {
        let color = 'blue';
        if (security === 'Mật') color = 'orange';
        if (security === 'Tối mật') color = 'red';
        return (
          <div className="space-y-1">
            <Tag color={color} className="rounded font-medium flex items-center w-max gap-1 px-2 py-0.5 text-xs">
              <LockOutlined className="text-[10px]" /> {security}
            </Tag>
            <div className="text-xs text-gray-500 max-w-[150px] truncate" title={record.department}>
              {record.department}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Ngày tải',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date) => <span className="text-gray-600 text-sm font-medium">{date}</span>
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
            className="rounded border-none px-2.5 py-0.5 font-semibold text-xs"
            style={{ backgroundColor: bg, color: text }}
          >
            {status || 'Đã duyệt'}
          </Tag>
        );
      }
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approver',
      key: 'approver',
      render: (approver) => approver ? (
        <span className="font-semibold text-gray-700 text-sm">{approver}</span>
      ) : (
        <span className="text-gray-400 italic text-sm">Chưa duyệt</span>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const isLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);
        const menuItems = [
          {
            key: 'detail',
            label: 'Xem chi tiết',
            icon: <EyeOutlined className="text-blue-600" />,
            onClick: () => handleOpenDrawer(record)
          },
          ...(isLeader ? [
            {
              key: 'edit',
              label: 'Chỉnh sửa tài liệu',
              icon: <EditOutlined className="text-indigo-600" />,
              onClick: () => {
                const deptArray = typeof record.department === 'string' 
                  ? record.department.split(', ').filter(d => d) 
                  : record.department;
                form.setFieldsValue({
                  ...record,
                  department: deptArray
                });
                setIsModalVisible(true);
              }
            },
            {
              key: 'status-submenu',
              label: 'Cập nhật trạng thái',
              icon: <SyncOutlined className="text-amber-500" />,
              children: [
                {
                  key: 'status-pending',
                  label: 'Chờ duyệt',
                  onClick: () => {
                    setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Chờ duyệt', aiLearned: false, approver: null } : item));
                    message.info('Đã chuyển trạng thái sang Chờ duyệt');
                  }
                },
                {
                  key: 'status-approved',
                  label: 'Đã duyệt',
                  onClick: () => {
                    setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã duyệt', approver: currentUser?.fullName || 'Lãnh đạo' } : item));
                    message.success('Đã duyệt tài liệu!');
                    handleCopyToPublic({ ...record, status: 'Đã duyệt' });
                  }
                },
                {
                  key: 'status-revoked',
                  label: 'Đã thu hồi',
                  onClick: () => {
                    setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã thu hồi', aiLearned: false, approver: null } : item));
                    message.warning('Đã thu hồi tài liệu!');
                  }
                }
              ]
            },
            ...(record.status === 'Đã duyệt' ? [{
              key: 'make-public',
              label: 'Chuyển sang công khai',
              icon: <GlobalOutlined className="text-emerald-600" />,
              onClick: () => handleCopyToPublic(record)
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
      const { file, images, department, ...restValues } = values;
      const deptStr = Array.isArray(department) ? department.join(', ') : department;
      
      let uploadedFileName = `${values.title}.pdf`; 
      let fileUrl = null;
      let uploadedImages = [];
      
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

      if (isEdit) {
        setData(prev => prev.map(item => item.id === values.id ? { 
          ...item, 
          ...restValues, 
          department: deptStr, 
          fileName: uploadedFileName, 
          fileUrl: fileUrl || item.fileUrl,
          images: uploadedImages.length > 0 ? uploadedImages : item.images
        } : item));
        message.success('Đã cập nhật tài liệu!');
      } else {
        const newDoc = {
          ...restValues,
          department: deptStr,
          fileName: uploadedFileName,
          fileUrl: fileUrl,
          images: uploadedImages,
          id: `ID00${data.length + 1}`,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Chờ duyệt',
          aiLearned: false,
          fileSize: '1.5 MB'
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Tải lên tài liệu thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Tiêu đề & Nút thêm */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0">Quản lý tài liệu Nội bộ</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Quản lý và cấp quyền truy cập tài liệu cho AI Nội bộ và các phòng ban.</p>
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
              placeholder="Tìm kiếm theo tiêu đề, số hiệu..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              className="rounded-lg h-10 border-gray-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-gray-500 hidden sm:inline">Bộ lọc:</span>
            <Select 
              placeholder="Loại văn bản"
              value={filterDocType || undefined}
              onChange={setFilterDocType}
              style={{ width: 150 }}
              allowClear
              className="rounded-lg"
            >
              <Option value="Báo cáo">Báo cáo</Option>
              <Option value="Kế hoạch">Kế hoạch</Option>
              <Option value="Quy trình nghiệp vụ">Quy trình nghiệp vụ</Option>
              <Option value="Hướng dẫn">Hướng dẫn</Option>
              <Option value="Chỉ đạo điều hành">Chỉ đạo điều hành</Option>
            </Select>

            <Select 
              placeholder="Trạng thái"
              value={filterStatus || undefined}
              onChange={setFilterStatus}
              style={{ width: 130 }}
              allowClear
              className="rounded-lg"
            >
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đã thu hồi">Đã thu hồi</Option>
            </Select>
            
            {(searchText || filterDocType || filterStatus) && (
              <Button 
                type="text" 
                danger
                onClick={() => {
                  setSearchText('');
                  setFilterDocType('');
                  setFilterStatus('');
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
          pagination={{ pageSize: 5, showSizeChanger: true, hideOnSinglePage: true, showTotal: (t) => `Tổng số ${t} tài liệu` }}
        />
      </Card>

      {/* Modal Upload & Chỉnh sửa */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-900 border-b pb-3 mb-2 font-bold text-base">
            <FileTextOutlined className="text-blue-600" />
            <span>{form.getFieldValue('id') ? "Cập nhật thông tin tài liệu" : "Tải lên tài liệu nội bộ"}</span>
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
              name="docNumber" 
              label={<span className="font-semibold text-gray-700 text-xs">Số / Ký hiệu văn bản</span>}
            >
              <Input placeholder="VD: 45/BC-UBND" className="rounded-lg h-9" />
            </Form.Item>

            <Form.Item 
              name="uploadDate" 
              label={<span className="font-semibold text-gray-700 text-xs">Ngày lưu trữ</span>} 
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              initialValue={new Date().toISOString().split('T')[0]}
            >
              <Input type="date" className="rounded-lg h-9" />
            </Form.Item>
          </div>

          <Form.Item 
            name="title" 
            label={<span className="font-semibold text-gray-700 text-xs">Trích yếu nội dung (Tiêu đề tài liệu)</span>} 
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu văn bản!' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập tóm tắt trích yếu của văn bản..." className="rounded-lg" />
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item 
              name="docType" 
              label={<span className="font-semibold text-gray-700 text-xs">Loại văn bản</span>} 
              rules={[{ required: true, message: 'Vui lòng chọn loại văn bản!' }]}
            >
              <Select placeholder="Chọn loại văn bản" className="h-9 rounded-lg">
                <Option value="Báo cáo">Báo cáo</Option>
                <Option value="Kế hoạch">Kế hoạch</Option>
                <Option value="Quy trình nghiệp vụ">Quy trình nghiệp vụ</Option>
                <Option value="Hướng dẫn">Hướng dẫn</Option>
                <Option value="Chỉ đạo điều hành">Chỉ đạo điều hành</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="securityLevel" 
              label={<span className="font-semibold text-gray-700 text-xs">Mức độ bảo mật</span>} 
              rules={[{ required: true }]} 
              initialValue="Nội bộ"
            >
              <Select placeholder="Chọn mức độ" className="h-9 rounded-lg">
                <Option value="Nội bộ">Lưu hành nội bộ</Option>
                <Option value="Mật">Mật</Option>
                <Option value="Tối mật">Tối mật</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item 
            name="department" 
            label={<span className="font-semibold text-gray-700 text-xs">Cấp quyền phòng ban xem</span>} 
            rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
          >
            <Select placeholder="Chọn phòng ban được truy cập" mode="multiple" maxTagCount="responsive" className="rounded-lg">
              <Option value="Văn phòng Đảng uỷ">Văn phòng Đảng uỷ</Option>
              <Option value="Tài chính - Kế toán">Tài chính - Kế toán</Option>
              <Option value="Thanh tra">Thanh tra</Option>
              <Option value="Địa chính - Xây dựng">Địa chính - Xây dựng</Option>
              <Option value="Tư pháp - Hộ tịch">Tư pháp - Hộ tịch</Option>
              <Option value="Lãnh đạo UBND">Lãnh đạo UBND</Option>
              <Option value="Tất cả phòng ban">Tất cả phòng ban</Option>
            </Select>
          </Form.Item>
          
          <Divider className="my-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item 
              name="file" 
              label={<span className="font-semibold text-gray-700 text-xs">File tài liệu (PDF, DOCX)</span>} 
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              rules={[{ required: !form.getFieldValue('id'), message: 'Vui lòng đính kèm file!' }]}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />} className="flex items-center rounded-lg h-9 border-dashed w-full justify-center text-xs">
                  Chọn File
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item 
              name="images" 
              label={<span className="font-semibold text-gray-700 text-xs">Ảnh đính kèm / Phụ lục</span>} 
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload beforeUpload={() => false} accept="image/*" multiple>
                <Button icon={<UploadOutlined />} className="flex items-center rounded-lg h-9 border-dashed w-full justify-center text-xs">
                  Tải lên ảnh
                </Button>
              </Upload>
            </Form.Item>
          </div>
          
          <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-blue-800 flex items-start border border-blue-100">
            <RobotOutlined className="w-5 h-5 mr-2 text-blue-600 text-base mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block mb-0.5">Huấn luyện Trợ lý AI</span>
              <span>Tài liệu nội bộ được duyệt sẽ được nạp tự động vào Vector DB của AI và chỉ phục vụ trả lời cho các phòng ban được cấp quyền truy cập nêu trên.</span>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal xem chi tiết tài liệu */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-900 border-b pb-3 mb-2 font-bold text-base">
            <RobotOutlined className="text-blue-600" />
            <span>Thông tin tài liệu & AI</span>
          </div>
        }
        open={isDrawerVisible}
        onCancel={() => setIsDrawerVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDrawerVisible(false)} className="rounded-lg h-9">
            Đóng
          </Button>
        ]}
        width={580}
      >
        {selectedDoc && (
          <div className="space-y-5">
            {/* Header */}
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block">
                {selectedDoc.docType}
              </span>
              <h3 className="text-sm font-bold text-slate-800 leading-normal m-0">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-2 mb-0 flex items-center gap-2">
                <span>Mã số: #{selectedDoc.id}</span>
                <span>•</span>
                <span>Số hiệu: {selectedDoc.docNumber || 'Không'}</span>
              </p>
            </div>

            {/* Chi tiết */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                Thông tin lưu trữ
              </h4>
              
              <div className="grid grid-cols-3 gap-y-2.5 text-xs">
                <span className="text-gray-500">Mức bảo mật:</span>
                <span className="col-span-2 font-semibold">
                  <Tag color={selectedDoc.securityLevel === 'Mật' ? 'orange' : selectedDoc.securityLevel === 'Tối mật' ? 'red' : 'blue'} className="m-0 text-[11px]">
                    {selectedDoc.securityLevel}
                  </Tag>
                </span>

                <span className="text-gray-500">Cấp quyền:</span>
                <span className="col-span-2 text-gray-800 font-semibold">{selectedDoc.department}</span>

                <span className="text-gray-500">Ngày tải:</span>
                <span className="col-span-2 text-slate-600 font-medium">{selectedDoc.uploadDate}</span>

                <span className="text-gray-500">Trạng thái:</span>
                <span className="col-span-2 font-semibold">
                  {(() => {
                    const status = selectedDoc.status || 'Đã duyệt';
                    let color = 'default';
                    if (status === 'Đã duyệt') color = 'blue';
                    if (status === 'Chờ duyệt') color = 'warning';
                    if (status === 'Đã thu hồi') color = 'red';
                    return <Tag color={color} className="rounded m-0 text-[11px] font-medium">{status}</Tag>;
                  })()}
                </span>

                <span className="text-gray-500">Người phê duyệt:</span>
                <span className="col-span-2 text-slate-700 font-bold">
                  {selectedDoc.approver || <span className="text-gray-400 font-normal italic">Chờ phê duyệt</span>}
                </span>
              </div>
            </div>

            {/* Vector DB AI */}
            <Card className="rounded-lg border border-blue-100 bg-blue-50/10 p-3" styles={{ body: { padding: 0 } }}>
              <div className="flex items-start gap-3">
                <Avatar icon={<RobotOutlined />} size={36} className="bg-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-blue-950 mb-0.5 m-0">Đồng bộ Vector DB AI</h4>
                  <p className="text-[10px] text-gray-500 mb-2">Đồng bộ học tập cho Trợ lý AI</p>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Progress 
                      type="circle" 
                      percent={selectedDoc.aiLearned ? 100 : 0} 
                      size={44} 
                      strokeColor="#2563eb"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">
                        {selectedDoc.aiLearned ? 'Đã học hoàn tất' : 'Chờ đồng bộ'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {selectedDoc.aiLearned ? 'AI đã có tri thức' : 'Nhấn nút để đồng bộ ngay'}
                      </div>
                    </div>
                  </div>

                  {selectedDoc.status === 'Đã duyệt' && (
                    <Button 
                      type="primary"
                      size="small"
                      className="w-full bg-blue-600 hover:bg-blue-700 border-none rounded h-8 text-xs font-semibold flex items-center justify-center gap-1"
                      icon={<SyncOutlined spin={isSyncingAI} />}
                      loading={isSyncingAI}
                      onClick={() => handleSyncAI(selectedDoc.id)}
                    >
                      {selectedDoc.aiLearned ? 'Đồng bộ lại' : 'Đồng bộ Vector DB'}
                    </Button>
                  )}
                  {selectedDoc.status === 'Chờ duyệt' && (
                    <div className="bg-amber-50 p-2 rounded border border-amber-100 text-[10px] text-amber-800">
                      Tài liệu cần được duyệt trước khi nạp dữ liệu.
                    </div>
                  )}
                  {selectedDoc.status === 'Đã thu hồi' && (
                    <div className="bg-red-50 p-2 rounded border border-red-100 text-[10px] text-red-800">
                      Tài liệu bị thu hồi, AI đã quên thông tin.
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Đính kèm */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                File gốc đính kèm
              </h4>
              
              {selectedDoc.fileName ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0">{getFileIcon(selectedDoc.fileName)}</div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate" title={selectedDoc.fileName}>
                        {selectedDoc.fileName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{selectedDoc.fileSize || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 flex-shrink-0">
                    {selectedDoc.fileUrl ? (
                      <>
                        <Button 
                          type="text" 
                          shape="circle" 
                          size="small"
                          icon={<EyeOutlined className="text-blue-600 text-sm" />} 
                          onClick={() => window.open(selectedDoc.fileUrl, '_blank')}
                        />
                        <Button 
                          type="text" 
                          shape="circle" 
                          size="small"
                          icon={<DownloadOutlined className="text-slate-600 text-sm" />} 
                          href={selectedDoc.fileUrl}
                          download={selectedDoc.fileName}
                        />
                      </>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">Bản nháp</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded text-center">
                  Không có file đính kèm
                </div>
              )}
            </div>

            {/* Hình ảnh */}
            {selectedDoc.images && selectedDoc.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                  Phụ lục ảnh
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {selectedDoc.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img.url} 
                      alt="phu-luc" 
                      className="w-full h-12 object-cover rounded border cursor-pointer hover:opacity-85" 
                      onClick={() => window.open(img.url, '_blank')} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InternalDocs;
