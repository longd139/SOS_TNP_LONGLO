import React, { useState } from 'react';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Upload, message, Tooltip, Drawer, Descriptions, Progress, Divider, Space } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, RobotOutlined, FilePdfOutlined, CheckCircleOutlined, UserOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';

const { Title, Text } = Typography;
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
    approver: 'Trần Văn A'
  }
];

const InternalDocs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('internalDocsData_v2');
    return saved ? JSON.parse(saved) : internalDocsMock;
  });

  React.useEffect(() => {
    localStorage.setItem('internalDocsData_v2', JSON.stringify(data));
  }, [data]);

  const [form] = Form.useForm();
  
  const { currentRole, currentUser } = useMock();

  const handleOpenDrawer = (record) => {
    setSelectedDoc(record);
    setIsDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      render: (text, record) => (
        <span 
          className="text-blue-600 underline cursor-pointer hover:text-blue-800 font-medium"
          onClick={() => handleOpenDrawer(record)}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Phòng ban truy cập',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => <Tag color="geekblue">{dept}</Tag>,
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Trợ lý AI nội bộ',
      dataIndex: 'aiLearned',
      key: 'aiLearned',
      render: (learned) => (
        <Tooltip title={learned ? "AI đã học xong tài liệu này" : "AI đang học hoặc chưa được cấp quyền"}>
          <Tag color={learned ? 'green' : 'default'} icon={<RobotOutlined className="w-3 h-3 inline mr-1" />}>
            {learned ? 'Đã học' : 'Chưa học'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đã duyệt') color = 'green';
        if (status === 'Chờ duyệt') color = 'gold';
        if (status === 'Đã thu hồi') color = 'red';
        return <Tag color={color}>{status || 'Đã duyệt'}</Tag>;
      }
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approver',
      key: 'approver',
      render: (approver, record) => approver ? <span className="font-medium text-gray-700">{approver}</span> : <span className="text-gray-400 italic">Chưa duyệt</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          {currentRole === 'APPROVER' && record.status === 'Chờ duyệt' && (
            <Tooltip title="Phê duyệt">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined className="w-4 h-4 text-green-600" />} 
                onClick={() => {
                  setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã duyệt', aiLearned: true, approver: currentUser?.fullName || 'Lãnh đạo' } : item));
                  message.success('Đã phê duyệt tài liệu! AI sẽ bắt đầu học dữ liệu này.');
                }}
              />
            </Tooltip>
          )}
          {currentRole === 'APPROVER' && record.status === 'Đã duyệt' && (
            <Tooltip title="Thu hồi tài liệu">
              <Button 
                type="text" 
                icon={<ClockCircleOutlined className="w-4 h-4 text-orange-600" />} 
                onClick={() => {
                  setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã thu hồi', aiLearned: false, approver: null } : item));
                  message.warning('Đã thu hồi tài liệu!');
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined className="w-4 h-4 text-blue-600" />} 
              onClick={() => {
                const deptArray = typeof record.department === 'string' 
                  ? record.department.split(', ').filter(d => d) 
                  : record.department;
                form.setFieldsValue({
                  ...record,
                  department: deptArray
                });
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined className="w-4 h-4 text-red-600" />} 
              onClick={() => {
                setData(prev => prev.filter(item => item.id !== record.id));
                message.success('Đã xóa tài liệu (Demo)');
              }}
            />
          </Tooltip>
        </div>
      ),
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
        message.success('Đã cập nhật tài liệu thành công!');
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
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Đã nộp tài liệu! Vui lòng chờ phê duyệt.');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <Title level={2} className="text-gray-800 m-0">Quản lý tài liệu Nội bộ</Title>
            <div className="text-gray-500 mt-1">Quản lý và cấp quyền truy cập tài liệu cho AI Nội bộ và các phòng ban.</div>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined className="w-4 h-4 mr-2" />} 
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-600 flex items-center"
          >
            Tải tài liệu mới
          </Button>
        </div>

        <Card className="shadow-sm">
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="id"
          />
        </Card>

        <Modal
          title="Tải lên tài liệu nội bộ"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" className="mt-4">
            <Form.Item name="id" hidden><Input /></Form.Item>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="docNumber" label="Số/Ký hiệu (nếu có)">
                <Input placeholder="VD: 15/KH-UBND" />
              </Form.Item>

              <Form.Item name="uploadDate" label="Ngày lưu trữ" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </div>

            <Form.Item name="title" label="Trích yếu nội dung (Tên tài liệu)" rules={[{ required: true }]}>
              <Input.TextArea rows={2} placeholder="Nhập trích yếu hoặc tên tài liệu nội bộ..." />
            </Form.Item>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="docType" label="Loại văn bản" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại văn bản">
                  <Option value="Báo cáo">Báo cáo</Option>
                  <Option value="Kế hoạch">Kế hoạch</Option>
                  <Option value="Quy trình nghiệp vụ">Quy trình nghiệp vụ</Option>
                  <Option value="Hướng dẫn">Hướng dẫn</Option>
                  <Option value="Chỉ đạo điều hành">Chỉ đạo điều hành</Option>
                </Select>
              </Form.Item>

              <Form.Item name="securityLevel" label="Mức độ bảo mật" rules={[{ required: true }]} initialValue="Nội bộ">
                <Select placeholder="Chọn mức độ">
                  <Option value="Nội bộ">Lưu hành nội bộ</Option>
                  <Option value="Mật">Mật</Option>
                  <Option value="Tối mật">Tối mật</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="department" label="Cấp quyền truy cập" rules={[{ required: true }]}>
                <Select placeholder="Chọn phòng ban được phép xem" mode="multiple" maxTagCount="responsive">
                  <Option value="Văn phòng Đảng uỷ">Văn phòng Đảng uỷ</Option>
                  <Option value="Tài chính - Kế toán">Tài chính - Kế toán</Option>
                  <Option value="Thanh tra">Thanh tra</Option>
                  <Option value="Địa chính - Xây dựng">Địa chính - Xây dựng</Option>
                  <Option value="Tư pháp - Hộ tịch">Tư pháp - Hộ tịch</Option>
                  <Option value="Lãnh đạo UBND">Lãnh đạo UBND</Option>
                  <Option value="Tất cả phòng ban">Tất cả phòng ban</Option>
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item 
              name="file" 
              label="File đính kèm (Văn bản / PDF, DOCX)" 
              rules={[{ required: true }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined className="w-4 h-4 mr-2" />} className="flex items-center">Chọn văn bản</Button>
              </Upload>
            </Form.Item>

            <Form.Item 
              name="images" 
              label="Tải ảnh lên (Hình ảnh minh chứng/đính kèm)" 
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload beforeUpload={() => false} accept="image/*" multiple>
                <Button icon={<UploadOutlined className="w-4 h-4 mr-2" />} className="flex items-center">Chọn Ảnh</Button>
              </Upload>
            </Form.Item>
            
            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-center">
              <RobotOutlined className="w-5 h-5 mr-2" />
              <span>Tài liệu sẽ được mã hóa và nạp vào Vector Database. Trợ lý AI chỉ trả lời dữ liệu này cho các user thuộc Phòng ban được cấp quyền.</span>
            </div>
          </Form>
        </Modal>

        <Drawer
          title="Chi tiết Tài liệu Nội bộ"
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
          width={500}
        >
          {selectedDoc && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên tài liệu"><span className="font-medium text-blue-700">{selectedDoc.title}</span></Descriptions.Item>
              <Descriptions.Item label="Số/Ký hiệu">{selectedDoc.docNumber}</Descriptions.Item>
              <Descriptions.Item label="Loại văn bản"><Tag color="blue">{selectedDoc.docType}</Tag></Descriptions.Item>
              <Descriptions.Item label="Mức độ bảo mật">
                <Tag color={selectedDoc.securityLevel === 'Mật' ? 'red' : 'orange'}>{selectedDoc.securityLevel}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban truy cập">{selectedDoc.department}</Descriptions.Item>
              <Descriptions.Item label="Ngày tải lên">{selectedDoc.uploadDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái kiểm duyệt">
                {(() => {
                  const status = selectedDoc.status || 'Đã duyệt';
                  let color = 'default';
                  if (status === 'Đã duyệt') color = 'green';
                  if (status === 'Chờ duyệt') color = 'gold';
                  if (status === 'Đã thu hồi') color = 'red';
                  return <Tag color={color}>{status}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Người duyệt">{selectedDoc.approver || <span className="text-gray-400 italic">Chưa duyệt</span>}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái AI">
                {selectedDoc.aiLearned ? <Tag color="green" icon={<RobotOutlined />}>Đã học</Tag> : <Tag color="default" icon={<RobotOutlined />}>Chưa học</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="File đính kèm">
                {selectedDoc.fileName ? (
                  selectedDoc.fileUrl ? (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center text-gray-800">
                        <FilePdfOutlined className="mr-1 text-red-500" /> {selectedDoc.fileName}
                      </span>
                      <a href={selectedDoc.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                        Xem
                      </a>
                      <span className="text-gray-300">|</span>
                      <a href={selectedDoc.fileUrl} download={selectedDoc.fileName} className="text-sm text-blue-600 hover:underline">
                        Tải về
                      </a>
                    </div>
                  ) : (
                    <span className="flex items-center text-gray-600">
                      <FilePdfOutlined className="mr-1 text-gray-400" /> {selectedDoc.fileName} (Bản nháp - Không có file)
                    </span>
                  )
                ) : 'Không có file đính kèm'}
              </Descriptions.Item>
              
              {selectedDoc.images && selectedDoc.images.length > 0 && (
                <Descriptions.Item label="Hình ảnh đính kèm">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDoc.images.map((img, idx) => (
                      <img key={idx} src={img.url} alt="minh-chung" className="w-24 h-24 object-cover rounded border shadow-sm cursor-pointer hover:opacity-80" onClick={() => window.open(img.url, '_blank')} />
                    ))}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default InternalDocs;
