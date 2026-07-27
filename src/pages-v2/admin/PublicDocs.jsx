import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Switch, message, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GlobalOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const publicDocsMock = [
  {
    id: 'PD001',
    docNumber: '104/2022/NĐ-CP',
    title: 'Nghị định quy định chi tiết một số điều của Luật Cư trú',
    category: 'Văn bản quy phạm pháp luật',
    issueDate: '2022-12-21',
    isPublished: true,
    fileName: 'Nghi_dinh_104.pdf'
  },
  {
    id: 'PD002',
    docNumber: 'N/A',
    title: 'Lịch sử hình thành và phát triển Phường Tăng Nhơn Phú',
    category: 'Văn hóa lịch sử',
    issueDate: '2023-01-15',
    isPublished: true,
    fileName: 'Lich_su_TNP.pdf'
  }
];

const PublicDocs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState(publicDocsMock);
  const [form] = Form.useForm();
  const location = useLocation();

  // Filter based on URL query
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category'); // 'history' or 'legal'

  const displayData = data.filter(item => {
    if (categoryFilter === 'history') return item.category === 'Văn hóa lịch sử';
    if (categoryFilter === 'legal') return item.category === 'Văn bản quy phạm pháp luật';
    return true; // Show all if no filter
  });

  const handleTogglePublish = (id, checked) => {
    setData(prev => prev.map(doc => 
      doc.id === id ? { ...doc, isPublished: checked } : doc
    ));
    message.success(`Đã ${checked ? 'xuất bản' : 'hủy xuất bản'} tài liệu!`);
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      width: '45%',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === 'Văn bản quy phạm pháp luật' ? 'blue' : 'orange'}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: 'Trạng thái (Xuất bản)',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished, record) => (
        <Switch 
          checked={isPublished} 
          onChange={(checked) => handleTogglePublish(record.id, checked)} 
          checkedChildren="Đã xuất bản" 
          unCheckedChildren="Đang ẩn"
        />
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
              form.setFieldsValue(record);
              setIsModalVisible(true);
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
      const { file, ...restValues } = values;
      
      let uploadedFileName = `${values.title}.pdf`;
      if (file && file.fileList && file.fileList.length > 0) {
        uploadedFileName = file.fileList[0].name;
      }

      if (isEdit) {
        setData(prev => prev.map(item => item.id === values.id ? { ...item, ...restValues, fileName: uploadedFileName } : item));
        message.success('Đã cập nhật tài liệu công khai thành công!');
      } else {
        const newDoc = {
          ...restValues,
          fileName: uploadedFileName,
          id: `PD00${data.length + 1}`,
          issueDate: values.issueDate || new Date().toISOString().split('T')[0],
          isPublished: values.isPublished !== false,
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Đã thêm tài liệu công khai mới!');
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
            <Title level={2} className="text-gray-800 m-0">
              {categoryFilter === 'history' ? 'Tài liệu Văn hóa lịch sử' : 
               categoryFilter === 'legal' ? 'Văn bản Quy phạm pháp luật' : 
               'Quản lý tài liệu Công khai'}
            </Title>
            <div className="text-gray-500 mt-1">Quản lý danh mục Văn hóa lịch sử và Văn bản quy phạm pháp luật.</div>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined className="w-4 h-4 mr-2" />} 
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-600 flex items-center"
          >
            Thêm tài liệu mới
          </Button>
        </div>

        <Card className="shadow-sm">
          <Table 
            columns={columns} 
            dataSource={displayData} 
            rowKey="id"
          />
        </Card>

        <Modal
          title="Thêm tài liệu công khai"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" className="mt-4">
            <Form.Item name="id" hidden><Input /></Form.Item>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="docNumber" label="Số/Ký hiệu văn bản" rules={[{ required: true }]}>
                <Input placeholder="VD: 104/2022/NĐ-CP" />
              </Form.Item>

              <Form.Item name="issueDate" label="Ngày ban hành" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </div>

            <Form.Item name="title" label="Trích yếu nội dung (Tên tài liệu)" rules={[{ required: true }]}>
              <Input.TextArea rows={2} placeholder="Nhập trích yếu nội dung văn bản..." />
            </Form.Item>
            
            <Form.Item name="category" label="Danh mục (Phân loại)" rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục">
                <Option value="Văn hóa lịch sử">Văn hóa lịch sử</Option>
                <Option value="Văn bản quy phạm pháp luật">Văn bản quy phạm pháp luật</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="file" 
              label="File đính kèm (Bản gốc/Bản quét)" 
              rules={[{ required: true }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined className="w-4 h-4 mr-2" />} className="flex items-center">Chọn file (PDF, DOCX)</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="isPublished" label="Trạng thái hiển thị" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="Xuất bản ngay" unCheckedChildren="Lưu nháp" />
            </Form.Item>
            
            <div className="bg-orange-50 p-3 rounded text-sm text-orange-800 flex items-center">
              <GlobalOutlined className="w-5 h-5 mr-2" />
              <span>Tài liệu được "Xuất bản" sẽ ngay lập tức được hệ thống AI học để trả lời người dân.</span>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PublicDocs;
