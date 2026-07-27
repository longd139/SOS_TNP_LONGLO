import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Typography, Tag, Card, Modal, Form, Input, Select, Switch, message, Upload, Drawer, Descriptions, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GlobalOutlined, UploadOutlined, FilePdfOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useMock } from '../../mock/MockContext';

const { Title } = Typography;
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
    approver: 'Trần Văn A'
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
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('publicDocsData_v2');
    return saved ? JSON.parse(saved) : publicDocsMock;
  });

  React.useEffect(() => {
    localStorage.setItem('publicDocsData_v2', JSON.stringify(data));
  }, [data]);

  const [form] = Form.useForm();
  const location = useLocation();

  const { currentRole, currentUser } = useMock();

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

  const handleOpenDrawer = (record) => {
    setSelectedDoc(record);
    setIsDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      width: '45%',
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
      title: 'Trạng thái kiểm duyệt',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đã xuất bản') color = 'green';
        if (status === 'Chờ kiểm duyệt') color = 'gold';
        if (status === 'Hết hiệu lực') color = 'red';
        return <Tag color={color}>{status || 'Đã xuất bản'}</Tag>;
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
          {currentRole === 'APPROVER' && record.status === 'Chờ kiểm duyệt' && (
            <Tooltip title="Duyệt (Xuất bản)">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined className="w-4 h-4 text-green-600" />} 
                onClick={() => {
                  setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Đã xuất bản', approver: currentUser?.fullName || 'Lãnh đạo' } : item));
                  message.success('Đã xuất bản tài liệu công khai!');
                }}
              />
            </Tooltip>
          )}
          {currentRole === 'APPROVER' && record.status === 'Đã xuất bản' && (
            <Tooltip title="Hủy xuất bản (Gỡ xuống)">
              <Button 
                type="text" 
                icon={<ClockCircleOutlined className="w-4 h-4 text-orange-600" />} 
                onClick={() => {
                  setData(prev => prev.map(item => item.id === record.id ? { ...item, status: 'Hết hiệu lực', approver: null } : item));
                  message.warning('Đã gỡ tài liệu xuống!');
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined className="w-4 h-4 text-blue-600" />} 
              onClick={() => {
                form.setFieldsValue(record);
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
        message.success('Đã cập nhật tài liệu công khai thành công!');
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
        };
        setData(prev => [newDoc, ...prev]);
        message.success('Đã nộp tài liệu! Vui lòng chờ lãnh đạo duyệt xuất bản.');
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
          title={form.getFieldValue('id') ? "Cập nhật tài liệu" : "Thêm tài liệu công khai"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          width={700}
        >
          <Form form={form} layout="vertical" className="mt-4" initialValues={{ isPublished: true }}>
            <Form.Item name="id" hidden><Input /></Form.Item>
            
            <Form.Item name="category" label="Danh mục (Phân loại)" rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục" onChange={() => form.validateFields()}>
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
                    {/* Các trường chung hoặc của Văn bản quy phạm */}
                    {!isHistory && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Form.Item name="docNumber" label="Số/Ký hiệu văn bản" rules={[{ required: !isHistory }]}>
                          <Input placeholder="VD: 104/2022/NĐ-CP" />
                        </Form.Item>

                        <Form.Item name="effectiveDate" label="Ngày có hiệu lực" rules={[{ required: !isHistory }]}>
                          <Input type="date" />
                        </Form.Item>
                      </div>
                    )}

                    {/* Các trường dành riêng cho Văn hóa lịch sử */}
                    {isHistory && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <div className="font-medium text-gray-700 mb-3">Thông tin Di tích / Văn hóa</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                          <Form.Item name="relicName" label="Tên di tích / Lễ hội" rules={[{ required: isHistory }]}>
                            <Input placeholder="VD: Đình Phong Phú" />
                          </Form.Item>
                          <Form.Item name="address" label="Địa chỉ" rules={[{ required: isHistory }]}>
                            <Input placeholder="VD: Khu phố 3, Phường Tăng Nhơn Phú B" />
                          </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                          <Form.Item name="subCategory" label="Phân loại" rules={[{ required: isHistory }]}>
                            <Select placeholder="Chọn loại">
                              <Option value="Di tích lịch sử">Di tích lịch sử</Option>
                              <Option value="Di tích kiến trúc nghệ thuật">Di tích kiến trúc nghệ thuật</Option>
                              <Option value="Lễ hội truyền thống">Lễ hội truyền thống</Option>
                            </Select>
                          </Form.Item>
                          
                          <Form.Item name="effectiveDate" label="Ngày công nhận / Ngày tổ chức" rules={[{ required: isHistory }]}>
                            <Input type="date" />
                          </Form.Item>
                        </div>
                        
                        <Form.Item name="issueDate" label="Ngày ghi nhận / Công nhận">
                          <Input type="date" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mt-2">
                          <Form.Item name="images" label="Upload ảnh" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                            <Upload beforeUpload={() => false} accept="image/*" multiple>
                              <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                            </Upload>
                          </Form.Item>

                          <Form.Item name="videos" label="Upload video" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                            <Upload beforeUpload={() => false} accept="video/*" multiple>
                              <Button icon={<UploadOutlined />}>Chọn Video</Button>
                            </Upload>
                          </Form.Item>

                          <Form.Item name="audios" label="Upload audio" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                            <Upload beforeUpload={() => false} accept="audio/*" multiple>
                              <Button icon={<UploadOutlined />}>Chọn Audio</Button>
                            </Upload>
                          </Form.Item>
                        </div>
                      </div>
                    )}

                    <Form.Item name="title" label={isHistory ? "Mô tả / Lịch sử hình thành" : "Trích yếu nội dung (Tên tài liệu)"} rules={[{ required: true }]}>
                      <Input.TextArea rows={3} placeholder={isHistory ? "Nhập thông tin lịch sử..." : "Nhập trích yếu nội dung văn bản..."} />
                    </Form.Item>

                    <Form.Item 
                      name="file" 
                      label={isHistory ? "Tài liệu đính kèm (PDF, DOCX - Tùy chọn)" : "File đính kèm (Bản gốc/Bản quét)"} 
                      rules={[{ required: !isHistory }]}
                      valuePropName="fileList"
                      getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                    >
                      <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined className="w-4 h-4 mr-2" />} className="flex items-center">Chọn file (PDF, DOCX)</Button>
                      </Upload>
                    </Form.Item>
                  </>
                );
              }}
            </Form.Item>

            <div className="bg-orange-50 p-3 rounded text-sm text-orange-800 flex items-center mt-4">
              <GlobalOutlined className="w-5 h-5 mr-2" />
              <span>Tài liệu sau khi được phê duyệt sẽ lập tức được hệ thống AI học để trả lời người dân.</span>
            </div>
          </Form>
        </Modal>

        <Drawer
          title="Chi tiết Tài liệu Công khai"
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
          width={500}
        >
          {selectedDoc && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên tài liệu"><span className="font-medium text-blue-700">{selectedDoc.title}</span></Descriptions.Item>
              <Descriptions.Item label="Số/Ký hiệu">{selectedDoc.docNumber}</Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color={selectedDoc.category === 'Văn bản quy phạm pháp luật' ? 'blue' : 'orange'}>
                  {selectedDoc.category}
                </Tag>
              </Descriptions.Item>
              {selectedDoc.category === 'Văn hóa lịch sử' && (
                <>
                  <Descriptions.Item label="Tên di tích / Lễ hội">{selectedDoc.relicName}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{selectedDoc.address || 'Chưa cập nhật'}</Descriptions.Item>
                  <Descriptions.Item label="Phân loại">{selectedDoc.subCategory}</Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Ngày ban hành">{selectedDoc.issueDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái kiểm duyệt">
                {(() => {
                  const status = selectedDoc.status || 'Đã xuất bản';
                  let color = 'default';
                  if (status === 'Đã xuất bản') color = 'green';
                  if (status === 'Chờ kiểm duyệt') color = 'gold';
                  if (status === 'Hết hiệu lực') color = 'red';
                  return <Tag color={color}>{status}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Người duyệt">{selectedDoc.approver || <span className="text-gray-400 italic">Chưa duyệt</span>}</Descriptions.Item>
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
                <Descriptions.Item label="Hình ảnh minh chứng">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDoc.images.map((img, idx) => (
                      <img key={idx} src={img.url} alt="minh-chung" className="w-24 h-24 object-cover rounded border shadow-sm cursor-pointer hover:opacity-80" onClick={() => window.open(img.url, '_blank')} />
                    ))}
                  </div>
                </Descriptions.Item>
              )}

              {selectedDoc.videos && selectedDoc.videos.length > 0 && (
                <Descriptions.Item label="Video minh chứng">
                  <div className="flex flex-col gap-2 mt-2">
                    {selectedDoc.videos.map((vid, idx) => (
                      <video key={idx} src={vid.url} controls className="w-full max-w-sm rounded border bg-black shadow-sm" />
                    ))}
                  </div>
                </Descriptions.Item>
              )}

              {selectedDoc.audios && selectedDoc.audios.length > 0 && (
                <Descriptions.Item label="Audio đính kèm">
                  <div className="flex flex-col gap-2 mt-2">
                    {selectedDoc.audios.map((aud, idx) => (
                      <audio key={idx} src={aud.url} controls className="w-full" />
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

export default PublicDocs;
