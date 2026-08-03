import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Switch, message, Upload, Drawer, Descriptions, Tooltip, Avatar, Divider, Progress, Dropdown } from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, GlobalOutlined, 
  UploadOutlined, FilePdfOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, FileWordOutlined, FileTextOutlined,
  SearchOutlined, EyeOutlined, DownloadOutlined, BookOutlined,
  VideoCameraOutlined, SoundOutlined, PictureOutlined, HistoryOutlined,
  CloseOutlined, EllipsisOutlined, SyncOutlined
} from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const publicDocsMock = [
  { 
    id: 'PD000', 
    category: 'Thủ tục hành chính', 
    docNumber: '15/TTHC', 
    title: 'Thủ tục đăng ký khai sinh lưu động', 
    issueDate: '2026-07-27', 
    status: 'Chờ kiểm duyệt',
    fileName: 'Thu_tuc_Khai_sinh.pdf',
    fileSize: '1.4 MB',
    approver: null
  },
  { 
    id: 'PD001', 
    docNumber: '104/2022/NĐ-CP',
    title: 'Nghị định quy định chi tiết một số điều của Luật Cư trú',
    category: 'Văn bản quy phạm pháp luật',
    issueDate: '2022-12-31',
    status: 'Đã xuất bản',
    fileName: 'NghiDinh_104_2022.pdf',
    fileSize: '3.8 MB',
    approver: 'Trần Văn A'
  },
  {
    id: 'PD002',
    docNumber: 'N/A',
    title: 'Lịch sử hình thành và phát triển Phường Tăng Nhơn Phú',
    category: 'Văn hóa lịch sử',
    issueDate: '2023-01-15',
    status: 'Đã xuất bản',
    fileName: 'Lich_su_TNP.pdf',
    fileSize: '8.2 MB',
    approver: 'Trần Văn A',
    relicName: 'UBND Phường Tăng Nhơn Phú',
    address: 'Số 10 Đường số 4, KP4, Tăng Nhơn Phú',
    subCategory: 'Văn hóa truyền thống',
    effectiveDate: '1997-04-01',
    images: [
      { name: 'Di_Tich_1.jpg', url: 'https://images.unsplash.com/photo-1596422846543-75c6fc1f7f43?w=500&auto=format&fit=crop&q=60' }
    ]
  }
];

const PublicDocs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('publicDocsData_v2');
    return saved ? JSON.parse(saved) : publicDocsMock;
  });

  // Tìm kiếm & Lọc
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  React.useEffect(() => {
    localStorage.setItem('publicDocsData_v2', JSON.stringify(data));
  }, [data]);

  const [form] = Form.useForm();
  const location = useLocation();
  const { currentRole, currentUser } = useMock();
  const isLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);

  // Đọc danh mục từ URL query
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category'); // 'history' or 'legal'

  // Tính toán KPI Stats
  const kpiStats = useMemo(() => {
    return {
      total: data.length,
      published: data.filter(d => d.status === 'Đã xuất bản' || d.isPublished).length,
      pending: data.filter(d => d.status === 'Chờ kiểm duyệt').length,
      expired: data.filter(d => d.status === 'Hết hiệu lực').length
    };
  }, [data]);

  // Lọc dữ liệu
  const displayData = useMemo(() => {
    const isLeader = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentRole);
    return data.filter(item => {
      // Nếu không phải lãnh đạo, chỉ hiện tài liệu đã xuất bản / đã duyệt
      if (!isLeader) {
        const isApproved = item.status === 'Đã xuất bản' || item.isPublished;
        if (!isApproved) return false;
      }

      if (categoryFilter === 'history' && item.category !== 'Văn hóa lịch sử') return false;
      if (categoryFilter === 'legal' && item.category !== 'Văn bản quy phạm pháp luật') return false;

      const matchText = !searchText || 
        item.title?.toLowerCase().includes(searchText.toLowerCase()) || 
        item.docNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.relicName?.toLowerCase().includes(searchText.toLowerCase());
      
      const matchCategory = !filterCategory || item.category === filterCategory;
      const matchStatus = !filterStatus || item.status === filterStatus;

      return matchText && matchCategory && matchStatus;
    });
  }, [data, categoryFilter, searchText, filterCategory, filterStatus, currentRole]);

  const handleOpenDrawer = (record) => {
    setSelectedDoc(record);
    setIsDrawerVisible(true);
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
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        let color = 'blue';
        if (category === 'Văn hóa lịch sử') color = 'purple';
        if (category === 'Thủ tục hành chính') color = 'orange';
        if (category === 'Biểu mẫu') color = 'cyan';
        return (
          <Tag color={color} className="rounded font-medium border-none px-2.5 py-0.5 text-xs">
            {category}
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        let isPub = status === 'Đã xuất bản' || record.isPublished;
        let color = 'default';
        let bg = 'rgba(100, 116, 139, 0.08)';
        let text = '#475569';
        let label = status || 'Đã xuất bản';

        if (isPub) {
          color = 'success';
          bg = 'rgba(37, 99, 235, 0.08)';
          text = '#2563eb';
          label = 'Đã xuất bản';
        } else if (status === 'Chờ kiểm duyệt') {
          color = 'warning';
          bg = 'rgba(245, 158, 11, 0.08)';
          text = '#b45309';
        } else if (status === 'Hết hiệu lực') {
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
            {label}
          </Tag>
        );
      }
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approver',
      key: 'approver',
      render: (approver, record) => {
        const isPub = record.status === 'Đã xuất bản' || record.isPublished;
        return approver || isPub ? (
          <span className="font-semibold text-gray-700 text-sm">{approver || 'Lãnh đạo'}</span>
        ) : (
          <span className="text-gray-400 italic text-sm">Chờ kiểm duyệt</span>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const isPub = record.status === 'Đã xuất bản' || record.isPublished;
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
                form.setFieldsValue(record);
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
                  label: 'Chờ kiểm duyệt',
                  onClick: () => {
                    setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Chờ kiểm duyệt', isPublished: false, approver: null } : item));
                    message.info('Đã chuyển trạng thái sang Chờ kiểm duyệt');
                  }
                },
                {
                  key: 'status-published',
                  label: 'Đã xuất bản',
                  onClick: () => {
                    setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã xuất bản', isPublished: true, approver: currentUser?.fullName || 'Lãnh đạo' } : item));
                    message.success('Đã xuất bản tài liệu!');
                  }
                },
                {
                  key: 'status-expired',
                  label: 'Hết hiệu lực',
                  onClick: () => {
                    setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Hết hiệu lực', isPublished: false, approver: null } : item));
                    message.warning('Đã gỡ tài liệu xuống!');
                  }
                }
              ]
            },
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
      const { file, images, videos, audios, ...restValues } = values;
      
      let uploadedFileName = `${values.title}.pdf`;
      let fileUrl = null;
      let uploadedImages = [];
      let uploadedVideos = [];
      let uploadedAudios = [];

      if (file && file.length > 0) {
        uploadedFileName = file[0].name;
        if (file[0].originFileObj) {
          fileUrl = URL.createObjectURL(file[0].originFileObj);
        }
      }

      const processMedia = (mediaArray) => {
        if (!mediaArray || mediaArray.length === 0) return [];
        return mediaArray.map(m => ({
          name: m.name,
          url: m.originFileObj ? URL.createObjectURL(m.originFileObj) : null
        })).filter(m => m.url);
      };

      uploadedImages = processMedia(images);
      uploadedVideos = processMedia(videos);
      uploadedAudios = processMedia(audios);

      if (isEdit) {
        setData(prev => prev.map(item => item.id === values.id ? { 
          ...item, 
          ...restValues, 
          fileName: uploadedFileName,
          fileUrl: fileUrl || item.fileUrl,
          images: uploadedImages.length > 0 ? uploadedImages : item.images,
          videos: uploadedVideos.length > 0 ? uploadedVideos : item.videos,
          audios: uploadedAudios.length > 0 ? uploadedAudios : item.audios,
        } : item));
        message.success('Đã cập nhật tài liệu!');
      } else {
        const newDoc = {
          ...restValues,
          fileName: uploadedFileName,
          fileUrl: fileUrl,
          images: uploadedImages,
          videos: uploadedVideos,
          audios: uploadedAudios,
          id: `PD00${data.length + 1}`,
          issueDate: values.issueDate || new Date().toISOString().split('T')[0],
          status: 'Chờ kiểm duyệt',
          isPublished: false,
          fileSize: '2.1 MB'
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Thêm tài liệu công khai thành công!');
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0">
            {categoryFilter === 'history' ? 'Tài liệu Văn hóa lịch sử' : 
             categoryFilter === 'legal' ? 'Văn bản Quy phạm pháp luật' : 
             'Quản lý tài liệu Công khai'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Quản lý các tài liệu công khai và dữ liệu văn hóa lịch sử địa phương.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            form.resetFields();
            if (categoryFilter === 'history') form.setFieldsValue({ category: 'Văn hóa lịch sử' });
            if (categoryFilter === 'legal') form.setFieldsValue({ category: 'Văn bản quy phạm pháp luật' });
            setIsModalVisible(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg px-4 h-10 flex items-center shadow-sm"
        >
          Thêm tài liệu
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
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Đã xuất bản</p>
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 m-0">{kpiStats.published}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg text-lg flex items-center">
              <GlobalOutlined />
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
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Hết hiệu lực</p>
              <h3 className="text-xl md:text-2xl font-bold text-red-600 m-0">{kpiStats.expired}</h3>
            </div>
            <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-lg flex items-center">
              <CloseOutlined />
            </div>
          </div>
        </Card>
      </div>

      {/* Thẻ Lọc & Tìm kiếm */}
      <Card className="shadow-sm border border-gray-200 rounded-lg" styles={{ body: { padding: 16 } }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <Input 
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm kiếm tài liệu..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              className="rounded-lg h-10 border-gray-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-gray-500 hidden sm:inline">Bộ lọc:</span>
            {!categoryFilter && (
              <Select 
                placeholder="Chọn danh mục"
                value={filterCategory || undefined}
                onChange={setFilterCategory}
                style={{ width: 180 }}
                allowClear
                className="rounded-lg"
              >
                <Option value="Văn hóa lịch sử">Văn hóa lịch sử</Option>
                <Option value="Văn bản quy phạm pháp luật">Văn bản quy phạm</Option>
                <Option value="Thủ tục hành chính">Thủ tục hành chính</Option>
                <Option value="Biểu mẫu">Biểu mẫu</Option>
              </Select>
            )}

            {isLeader && (
              <Select 
                placeholder="Trạng thái"
                value={filterStatus || undefined}
                onChange={setFilterStatus}
                style={{ width: 140 }}
                allowClear
                className="rounded-lg"
              >
                <Option value="Đã xuất bản">Đã xuất bản</Option>
                <Option value="Chờ kiểm duyệt">Chờ kiểm duyệt</Option>
                <Option value="Hết hiệu lực">Hết hiệu lực</Option>
              </Select>
            )}
            
            {(searchText || filterCategory || filterStatus) && (
              <Button 
                type="text" 
                danger
                onClick={() => {
                  setSearchText('');
                  setFilterCategory('');
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
          dataSource={displayData} 
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: true, hideOnSinglePage: true, showTotal: (t) => `Tổng số ${t} tài liệu` }}
        />
      </Card>

      {/* Modal Thêm mới / Cập nhật */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-900 border-b pb-3 mb-2 font-bold text-base">
            <BookOutlined className="text-blue-600" />
            <span>{form.getFieldValue('id') ? "Cập nhật tài liệu công khai" : "Thêm mới tài liệu công khai"}</span>
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
        <Form form={form} layout="vertical" className="mt-2" initialValues={{ isPublished: true }}>
          <Form.Item name="id" hidden><Input /></Form.Item>
          
          <Form.Item 
            name="category" 
            label={<span className="font-semibold text-gray-750 text-xs">Danh mục tài liệu</span>} 
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục" onChange={() => form.validateFields()} className="rounded-lg h-9">
              <Option value="Văn hóa lịch sử">Văn hóa lịch sử (Di tích, Lễ hội, ...)</Option>
              <Option value="Văn bản quy phạm pháp luật">Văn bản quy phạm pháp luật</Option>
              <Option value="Thủ tục hành chính">Thủ tục hành chính</Option>
              <Option value="Biểu mẫu">Biểu mẫu</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle dependencies={['category']}>
            {({ getFieldValue }) => {
              const category = getFieldValue('category');
              const isHistory = category === 'Văn hóa lịch sử';

              return (
                <>
                  {!isHistory && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <Form.Item 
                        name="docNumber" 
                        label={<span className="font-semibold text-gray-750 text-xs">Số/Ký hiệu văn bản</span>} 
                        rules={[{ required: !isHistory, message: 'Nhập số hiệu!' }]}
                      >
                        <Input placeholder="VD: 104/2022/NĐ-CP" className="rounded-lg h-9" />
                      </Form.Item>

                      <Form.Item 
                        name="issueDate" 
                        label={<span className="font-semibold text-gray-700 text-xs">Ngày ban hành</span>} 
                        rules={[{ required: !isHistory, message: 'Chọn ngày!' }]}
                      >
                        <Input type="date" className="rounded-lg h-9" />
                      </Form.Item>
                    </div>
                  )}

                  {isHistory && (
                    <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-gray-200">
                      <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-xs">
                        <HistoryOutlined className="text-blue-600" />
                        <span>Thông tin di tích lịch sử / Lễ hội</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                        <Form.Item 
                          name="relicName" 
                          label={<span className="text-gray-700 text-[11px] font-semibold">Tên di tích / Lễ hội</span>} 
                          rules={[{ required: isHistory, message: 'Nhập tên!' }]}
                        >
                          <Input placeholder="VD: Đình Phong Phú" className="rounded-lg h-9" />
                        </Form.Item>
                        <Form.Item 
                          name="address" 
                          label={<span className="text-gray-700 text-[11px] font-semibold">Địa điểm tổ chức</span>} 
                          rules={[{ required: isHistory, message: 'Nhập địa điểm!' }]}
                        >
                          <Input placeholder="VD: KP.3, Tăng Nhơn Phú" className="rounded-lg h-9" />
                        </Form.Item>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                        <Form.Item 
                          name="subCategory" 
                          label={<span className="text-gray-700 text-[11px] font-semibold">Phân loại</span>} 
                          rules={[{ required: isHistory, message: 'Chọn phân loại!' }]}
                          initialValue="Di tích lịch sử"
                        >
                          <Select placeholder="Chọn loại" className="h-9 rounded-lg">
                            <Option value="Di tích lịch sử">Di tích lịch sử</Option>
                            <Option value="Di tích kiến trúc nghệ thuật">Di tích kiến trúc nghệ thuật</Option>
                            <Option value="Lễ hội truyền thống">Lễ hội truyền thống</Option>
                            <Option value="Văn hóa truyền thống">Văn hóa truyền thống</Option>
                          </Select>
                        </Form.Item>
                        
                        <Form.Item 
                          name="issueDate" 
                          label={<span className="text-gray-700 text-[11px] font-semibold">Ngày công nhận / Ngày hội</span>} 
                          rules={[{ required: isHistory, message: 'Nhập ngày!' }]}
                        >
                          <Input type="date" className="rounded-lg h-9" />
                        </Form.Item>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 mt-1">
                        <Form.Item name="images" label={<span className="text-gray-600 text-[11px]">Tải hình ảnh</span>} valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                          <Upload beforeUpload={() => false} accept="image/*" multiple>
                            <Button icon={<PictureOutlined />} className="w-full text-xs rounded-lg h-9">Chọn ảnh</Button>
                          </Upload>
                        </Form.Item>

                        <Form.Item name="videos" label={<span className="text-gray-600 text-[11px]">Tải video</span>} valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                          <Upload beforeUpload={() => false} accept="video/*" multiple>
                            <Button icon={<VideoCameraOutlined />} className="w-full text-xs rounded-lg h-9">Chọn video</Button>
                          </Upload>
                        </Form.Item>

                        <Form.Item name="audios" label={<span className="text-gray-600 text-[11px]">Tải audio</span>} valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                          <Upload beforeUpload={() => false} accept="audio/*" multiple>
                            <Button icon={<SoundOutlined />} className="w-full text-xs rounded-lg h-9">Chọn audio</Button>
                          </Upload>
                        </Form.Item>
                      </div>
                    </div>
                  )}

                  <Form.Item 
                    name="title" 
                    label={<span className="font-semibold text-gray-700 text-xs">{isHistory ? "Mô tả / Thông tin lịch sử" : "Trích yếu nội dung văn bản"}</span>} 
                    rules={[{ required: true, message: 'Nhập thông tin mô tả!' }]}
                  >
                    <Input.TextArea rows={3} placeholder={isHistory ? "Nhập chi tiết lịch sử, nét văn hóa đặc trưng..." : "Nhập trích yếu tóm lược văn bản..."} className="rounded-lg" />
                  </Form.Item>

                  <Form.Item 
                    name="file" 
                    label={<span className="font-semibold text-gray-700 text-xs">{isHistory ? "File đính kèm (PDF, DOCX - Không bắt buộc)" : "File đính kèm bản gốc (PDF, DOCX)"}</span>} 
                    rules={[{ required: !isHistory, message: 'Vui lòng đính kèm file!' }]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                  >
                    <Upload maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />} className="flex items-center rounded-lg h-9 border-dashed">
                        Chọn file đính kèm
                      </Button>
                    </Upload>
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>

          <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-blue-800 flex items-start border border-blue-100 mt-2">
            <GlobalOutlined className="w-5 h-5 mr-2 text-blue-600 text-base mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block mb-0.5">Huấn luyện Trợ lý AI công cộng</span>
              <span>Văn bản sau khi được phê duyệt xuất bản sẽ tự động đồng bộ để AI học, hỗ trợ giải đáp trực tuyến cho người dân khi gửi thắc mắc.</span>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal xem chi tiết tài liệu */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-blue-900 border-b pb-3 mb-2 font-bold text-base">
            <BookOutlined className="text-blue-600" />
            <span>Chi tiết tài liệu Công khai</span>
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
                {selectedDoc.category}
              </span>
              <h3 className="text-sm font-bold text-slate-800 leading-normal m-0">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-2 mb-0 flex items-center gap-2">
                <span>Mã số: #{selectedDoc.id}</span>
                {selectedDoc.docNumber && selectedDoc.docNumber !== 'N/A' && (
                  <>
                    <span>•</span>
                    <span>Số hiệu: {selectedDoc.docNumber}</span>
                  </>
                )}
              </p>
            </div>

            {/* Chi tiết */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                Thông tin hành chính
              </h4>
              
              <div className="grid grid-cols-3 gap-y-2.5 text-xs">
                <span className="text-gray-500">Danh mục:</span>
                <span className="col-span-2 font-semibold text-gray-800">{selectedDoc.category}</span>

                {selectedDoc.category === 'Văn hóa lịch sử' && (
                  <>
                    <span className="text-gray-500">Địa danh/Di tích:</span>
                    <span className="col-span-2 text-blue-600 font-bold">{selectedDoc.relicName || 'N/A'}</span>

                    <span className="text-gray-500">Địa điểm:</span>
                    <span className="col-span-2 text-slate-700">{selectedDoc.address || 'N/A'}</span>

                    <span className="text-gray-500">Phân nhóm:</span>
                    <span className="col-span-2 font-semibold">{selectedDoc.subCategory || 'N/A'}</span>
                  </>
                )}

                <span className="text-gray-500">Ngày ban hành:</span>
                <span className="col-span-2 text-slate-600 font-medium">{selectedDoc.issueDate || 'N/A'}</span>

                <span className="text-gray-500">Người duyệt:</span>
                <span className="col-span-2 text-slate-700 font-bold">
                  {selectedDoc.approver || <span className="text-gray-455 font-normal italic">Đã xuất bản tự động</span>}
                </span>

                <span className="text-gray-500">Trạng thái:</span>
                <span className="col-span-2 font-semibold">
                  <Tag color={selectedDoc.status === 'Đã xuất bản' || selectedDoc.isPublished ? 'blue' : 'warning'} className="rounded m-0 text-[11px] font-medium">
                    {selectedDoc.status === 'Đã xuất bản' || selectedDoc.isPublished ? 'Đã xuất bản' : selectedDoc.status}
                  </Tag>
                </span>
              </div>
            </div>

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

            {/* Truyền thông di tích */}
            {selectedDoc.category === 'Văn hóa lịch sử' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 mb-0">
                  Hình ảnh & Phương tiện tư liệu
                </h4>
                
                {/* Ảnh */}
                {selectedDoc.images && selectedDoc.images.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold mb-1 block">Bộ sưu tập ảnh:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedDoc.images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img.url} 
                          alt="di-tich" 
                          className="w-full h-12 object-cover rounded border cursor-pointer hover:opacity-85" 
                          onClick={() => window.open(img.url, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Video */}
                {selectedDoc.videos && selectedDoc.videos.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold block">Video tư liệu di tích:</span>
                    {selectedDoc.videos.map((vid, idx) => (
                      <video key={idx} src={vid.url} controls className="w-full h-32 rounded bg-black object-contain" />
                    ))}
                  </div>
                )}

                {/* Audio */}
                {selectedDoc.audios && selectedDoc.audios.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold block">Audio thuyết minh:</span>
                    {selectedDoc.audios.map((aud, idx) => (
                      <div key={idx} className="p-1 rounded bg-slate-50 border flex items-center gap-2">
                        <SoundOutlined className="text-blue-600 text-sm" />
                        <audio src={aud.url} controls className="w-full h-8" />
                      </div>
                    ))}
                  </div>
                )}
                
                {(!selectedDoc.images && !selectedDoc.videos && !selectedDoc.audios) && (
                  <div className="text-[10px] text-gray-400 italic text-center py-2 bg-gray-50 rounded">
                    Chưa cập nhật tài liệu phương tiện.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PublicDocs;
