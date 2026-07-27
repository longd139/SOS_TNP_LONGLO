import React, { useState } from 'react';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Upload, message, Tooltip, Drawer, Descriptions, Progress, Divider, Space } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, RobotOutlined, FilePdfOutlined, CheckCircleOutlined, UserOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const internalDocsMock = [
  {
    id: 'ID001',
    docNumber: '15/KH-UBND',
    title: 'Kế hoạch triển khai chuyển đổi số Phường Tăng Nhơn Phú 2026',
    docType: 'Kế hoạch',
    securityLevel: 'Nội bộ',
    department: 'Tất cả phòng ban',
    uploadDate: '2026-05-10',
    fileName: 'Ke_hoach_chuyen_doi_so.pdf',
    aiLearned: true
  },
  {
    id: 'ID002',
    docNumber: '42/QĐ-UBND',
    title: 'Quyết định bổ nhiệm Cán bộ Tiếp nhận hồ sơ',
    docType: 'Chỉ đạo điều hành',
    securityLevel: 'Mật',
    department: 'Văn phòng Đảng uỷ, Lãnh đạo UBND',
    uploadDate: '2026-06-15',
    fileName: 'QD_bo_nhiem.pdf',
    aiLearned: false
  }
];

const InternalDocs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [data, setData] = useState(internalDocsMock);
  const [form] = Form.useForm();

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
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
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
              message.info('Đang mở chế độ chỉnh sửa (Demo)');
            }}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined className="w-4 h-4 text-red-600" />} 
            onClick={() => {
              setData(prev => prev.filter(item => item.id !== record.id));
              message.success('Đã xóa tài liệu (Demo)');
            }}
          />
        </div>
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      const isEdit = !!values.id;
      
      const { file, department, ...restValues } = values;
      const deptStr = Array.isArray(department) ? department.join(', ') : department;
      
      let uploadedFileName = `${values.title}.pdf`; 
      let fileUrl = null;
      
      if (file && file.fileList && file.fileList.length > 0) {
        uploadedFileName = file.fileList[0].name;
        if (file.fileList[0].originFileObj) {
          fileUrl = URL.createObjectURL(file.fileList[0].originFileObj);
        }
      }

      if (isEdit) {
        setData(prev => prev.map(item => item.id === values.id ? { ...item, ...restValues, department: deptStr, fileName: uploadedFileName, fileUrl: fileUrl || item.fileUrl } : item));
        message.success('Đã cập nhật tài liệu thành công!');
      } else {
        const newDoc = {
          ...restValues,
          department: deptStr,
          fileName: uploadedFileName,
          fileUrl: fileUrl,
          id: `ID00${data.length + 1}`,
          uploadDate: new Date().toISOString().split('T')[0],
          aiLearned: true,
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Đã tải lên tài liệu nội bộ thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
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
            
            <Form.Item name="department" label="Cấp quyền truy cập (Phòng ban)" rules={[{ required: true }]}>
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
            
            <Form.Item 
              name="file" 
              label="File đính kèm (Bảo mật)" 
              rules={[{ required: true }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined className="w-4 h-4 mr-2" />} className="flex items-center">Chọn file (PDF, DOCX)</Button>
              </Upload>
            </Form.Item>
            
            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-center">
              <RobotOutlined className="w-5 h-5 mr-2" />
              <span>Tài liệu sẽ được mã hóa và nạp vào Vector Database. Trợ lý AI chỉ trả lời dữ liệu này cho các user thuộc Phòng ban được cấp quyền.</span>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default InternalDocs;
