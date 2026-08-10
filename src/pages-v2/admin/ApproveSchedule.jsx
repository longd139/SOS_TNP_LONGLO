import React, { useEffect, useState } from 'react';
import { Table, Dropdown, message, Tabs, Modal, Button } from 'antd';
import { ClipboardCheck, User, MoreHorizontal, Eye, Check, X, Award, CalendarCheck } from 'lucide-react';

const MOCK_DATA = [
  {
    id: 'TICKET-001',
    leader: 'Ã”ng Nguyá»…n VÄƒn An',
    date: '2026-08-22',
    dayOfWeek: 'Thá»© SÃ¡u',
    timeSlot: 'SÃ¡ng (09:00 - 10:30)',
    status: 'PENDING',
    citizenInfo: {
      name: 'Nguyá»…n Thá»‹ Lan',
      phone: '0901234501',
      cccd: '079196001001',
      address: '12 ÄÆ°á»ng sá»‘ 5, Khu phá»‘ 2, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'ÄÆ°á»ng háº»m 23 Ä‘Æ°á»ng sá»‘ 7 xuá»‘ng cáº¥p nghiÃªm trá»ng, cÃ³ nhiá»u á»• gÃ  lá»›n gÃ¢y nguy hiá»ƒm cho ngÆ°á»i Ä‘i xe mÃ¡y vÃ o ban Ä‘Ãªm. KÃ­nh Ä‘á» nghá»‹...'
    }
  },
  {
    id: 'TICKET-002',
    leader: 'BÃ  Pháº¡m Thá»‹ Mai',
    date: '2026-08-23',
    dayOfWeek: 'Thá»© Báº£y',
    timeSlot: 'Chiá»u (14:00 - 15:30)',
    status: 'PENDING',
    citizenInfo: {
      name: 'Tráº§n VÄƒn HÃ¹ng',
      phone: '0912345502',
      cccd: '079196001002',
      address: '45/2 ÄÆ°á»ng sá»‘ 15, Khu phá»‘ 3, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'Khu vá»±c bÃ£i rÃ¡c tá»± phÃ¡t táº¡i cuá»‘i háº»m 45 Ä‘Æ°á»ng sá»‘ 15 gÃ¢y Ã´ nhiá»…m náº·ng. MÃ¹i hÃ´i thá»‘i áº£nh hÆ°á»Ÿng Ä‘áº¿n cuá»™c sá»‘ng sinh hoáº¡t...'
    }
  },
  {
    id: 'TICKET-003',
    leader: 'Ã”ng Tráº§n HoÃ ng Nam',
    date: '2026-08-25',
    dayOfWeek: 'Thá»© Ba',
    timeSlot: 'SÃ¡ng (09:00 - 10:30)',
    status: 'PENDING',
    citizenInfo: {
      name: 'LÃª Thá»‹ BÃ­ch',
      phone: '0934567803',
      cccd: '079196001003',
      address: '8 ÄÆ°á»ng sá»‘ 3, Khu phá»‘ 1, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'TÃ¬nh tráº¡ng tá»¥ táº­p nhÃ³m thanh niÃªn gÃ¢y máº¥t tráº­t tá»± cÃ´ng cá»™ng vÃ o buá»•i tá»‘i táº¡i khu vá»±c sÃ¢n chÆ¡i khu phá»‘ 1. Äá» nghá»‹ tÄƒng cÆ°á»ng tuáº§n tra an ninh táº¡i khu vá»±c nÃ y.'
    }
  },
  {
    id: 'TICKET-004',
    leader: 'Ã”ng Nguyá»…n VÄƒn An',
    date: '2026-08-20',
    dayOfWeek: 'Thá»© NÄƒm',
    timeSlot: 'Chiá»u (14:00 - 15:30)',
    status: 'APPROVED',
    citizenInfo: {
      name: 'Pháº¡m Quá»‘c Äáº¡t',
      phone: '0945678904',
      cccd: '079196001004',
      address: '102 ÄÆ°á»ng sá»‘ 12, Khu phá»‘ 7, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'HÃ ng xÃ³m xÃ¢y dá»±ng cÃ´ng trÃ¬nh sai phÃ©p, láº¥n chiáº¿m pháº§n diá»‡n tÃ­ch Ä‘áº¥t nhÃ  tÃ´i theo báº£n Ä‘á»“ Ä‘á»‹a chÃ­nh. Äá» nghá»‹ cÆ¡ quan cÃ³ tháº©m quyá»n vÃ o kiá»ƒm tra vÃ  xá»­ lÃ½ theo quy Ä‘á»‹nh phÃ¡p luáº­t.'
    }
  },
  {
    id: 'TICKET-005',
    leader: 'BÃ  Pháº¡m Thá»‹ Mai',
    date: '2026-08-27',
    dayOfWeek: 'Thá»© NÄƒm',
    timeSlot: 'SÃ¡ng (09:00 - 10:30)',
    status: 'PENDING',
    citizenInfo: {
      name: 'Äinh Tuáº¥n TÃ i',
      phone: '0987654325',
      cccd: '079196001005',
      address: '33 ÄÆ°á»ng BÆ°ng Ã”ng ThoÃ n, Khu phá»‘ 2, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'CÃ¢y xanh trÆ°á»›c nhÃ  sá»‘ 33 BÆ°ng Ã”ng ThoÃ n quÃ¡ lá»›n, cÃ nh lÃ¡ vÆ°á»›ng vÃ o Ä‘Æ°á»ng dÃ¢y Ä‘iá»‡n nguy hiá»ƒm trong mÃ¹a mÆ°a bÃ£o. Xin LÃ£nh Ä‘áº¡o chá»‰ Ä‘áº¡o cáº¯t tá»‰a.'
    }
  },
  {
    id: 'TICKET-006',
    leader: 'Ã”ng Tráº§n HoÃ ng Nam',
    date: '2026-08-28',
    dayOfWeek: 'Thá»© SÃ¡u',
    timeSlot: 'Chiá»u (14:00 - 15:30)',
    status: 'PENDING',
    citizenInfo: {
      name: 'NgÃ´ Thanh VÃ¢n',
      phone: '0909090909',
      cccd: '079196001006',
      address: '40/12 ÄÃ¬nh Phong PhÃº, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'Äá» nghá»‹ LÃ£nh Ä‘áº¡o há»— trá»£ giáº£i quyáº¿t thá»§ tá»¥c tÃ¡ch thá»­a Ä‘áº¥t nÃ´ng nghiá»‡p kÃ©o dÃ i hÆ¡n 6 thÃ¡ng chÆ°a cÃ³ káº¿t quáº£ máº·c dÃ¹ Ä‘Ã£ ná»™p Ä‘á»§ há»“ sÆ¡.'
    }
  },
  {
    id: 'TICKET-007',
    leader: 'Ã”ng Nguyá»…n VÄƒn An',
    date: '2026-08-29',
    dayOfWeek: 'Thá»© Báº£y',
    timeSlot: 'SÃ¡ng (09:00 - 10:30)',
    status: 'PENDING',
    citizenInfo: {
      name: 'Phan BÃ¡ CÆ°á»ng',
      phone: '0933112233',
      cccd: '079196001007',
      address: 'Chung cÆ° Safira, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'Chá»§ Ä‘áº§u tÆ° chung cÆ° thu phÃ­ quáº£n lÃ½ quÃ¡ cao so vá»›i thá»a thuáº­n ban Ä‘áº§u, gÃ¢y bá»©c xÃºc cho cÆ° dÃ¢n. Mong LÃ£nh Ä‘áº¡o chÃ­nh quyá»n Ä‘á»©ng ra tá»• chá»©c Ä‘á»‘i thoáº¡i.'
    }
  },
  {
    id: 'TICKET-008',
    leader: 'BÃ  Pháº¡m Thá»‹ Mai',
    date: '2026-08-30',
    dayOfWeek: 'Chá»§ Nháº­t',
    timeSlot: 'TÃ¹y chá»n thá»i gian',
    status: 'PENDING',
    citizenInfo: {
      name: 'ÄoÃ n Nháº­t Lá»‡',
      phone: '0911888999',
      cccd: '079196001008',
      address: '88 LÃ£ XuÃ¢n Oai, PhÆ°á»ng TÄƒng NhÆ¡n PhÃº B',
      content: 'Há»‡ thá»‘ng cá»‘ng thoÃ¡t nÆ°á»›c táº¡i tuyáº¿n Ä‘Æ°á»ng LÃ£ XuÃ¢n Oai thÆ°á»ng xuyÃªn ngáº­p ngháº¹t khi mÆ°a lá»›n. Xin kiáº¿n nghá»‹ cáº£i táº¡o náº¡o vÃ©t gáº¥p.'
    }
  }
];

export default function ApproveSchedule() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const localData = localStorage.getItem('citizen-approvals-v5');
    if (!localData) {
      localStorage.setItem('citizen-approvals-v5', JSON.stringify(MOCK_DATA));
      setData(MOCK_DATA);
    } else {
      setData(JSON.parse(localData));
    }
  }, []);

  const handleAction = (id, newStatus) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setData(updatedData);
    localStorage.setItem('citizen-approvals-v5', JSON.stringify(updatedData));

    let msg = 'ÄÃ£ cáº­p nháº­t tráº¡ng thÃ¡i';
    if (newStatus === 'APPROVED') msg = 'ÄÃ£ duyá»‡t lá»‹ch háº¹n thÃ nh cÃ´ng';
    if (newStatus === 'REJECTED') msg = 'ÄÃ£ tá»« chá»‘i lá»‹ch háº¹n';
    if (newStatus === 'CANCELED') msg = 'ÄÃ£ há»§y lá»‹ch háº¹n';
    if (newStatus === 'DONE') msg = 'ÄÃ£ Ä‘Ã¡nh dáº¥u tiáº¿p xong';
    message.success(msg);
    setIsModalOpen(false);
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

  const columns = [
    {
      title: 'MÃ£ phiáº¿u',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[12px] font-bold tracking-wide">
          {text}
        </span>
      )
    },
    {
      title: 'Há» tÃªn / SÄT',
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
      title: 'LÃ£nh Ä‘áº¡o Ä‘Æ°á»£c háº¹n',
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
      title: 'NgÃ y giá» háº¹n',
      key: 'time',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-gray-800 leading-none mb-1">{record.timeSlot}</span>
          <span className="text-[12px] text-gray-500 leading-none">{record.dayOfWeek} â€” {record.date.split('-').reverse().join('/')}</span>
        </div>
      )
    },
    {
      title: 'Ná»™i dung kiáº¿n nghá»‹',
      key: 'content',
      render: (_, record) => (
        <div className="text-[13px] text-gray-500 max-w-[300px] truncate" title={record.citizenInfo?.content}>
          {record.citizenInfo?.content}
        </div>
      )
    },
    {
      title: 'HÃ nh Ä‘á»™ng',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        let items = [
          {
            key: 'view',
            label: <span className="flex items-center text-gray-700"><Eye className="w-4 h-4 mr-2" /> Xem chi tiáº¿t há»“ sÆ¡</span>,
            onClick: () => openDetailModal(record)
          }
        ];

        if (record.status === 'PENDING') {
          items.push({ type: 'divider' });
          items.push({
            key: 'approve',
            label: <span className="flex items-center text-[#049669] font-medium"><Check className="w-4 h-4 mr-2" /> Duyá»‡t háº¹n</span>,
            onClick: () => handleAction(record.id, 'APPROVED')
          });
          items.push({
            key: 'reject',
            label: <span className="flex items-center text-[#ef4444] font-medium"><X className="w-4 h-4 mr-2" /> Tá»« chá»‘i</span>,
            onClick: () => handleAction(record.id, 'REJECTED')
          });
        } else if (record.status === 'APPROVED') {
          items.push({ type: 'divider' });
          items.push({
            key: 'done',
            label: <span className="flex items-center text-blue-600 font-medium"><CalendarCheck className="w-4 h-4 mr-2" /> ÄÃ¡nh dáº¥u Tiáº¿p xong</span>,
            onClick: () => handleAction(record.id, 'DONE')
          });
          items.push({
            key: 'cancel',
            label: <span className="flex items-center text-[#ef4444] font-medium"><X className="w-4 h-4 mr-2" /> Há»§y lá»‹ch háº¹n</span>,
            onClick: () => handleAction(record.id, 'CANCELED')
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

  const pendingCount = data.filter(d => d.status === 'PENDING').length;
  const approvedCount = data.filter(d => d.status === 'APPROVED').length;
  const doneCount = data.filter(d => d.status === 'DONE').length;
  const rejectedCount = data.filter(d => d.status === 'REJECTED').length;
  const canceledCount = data.filter(d => d.status === 'CANCELED').length;

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
            Chá» duyá»‡t
          </span>
        )}
        {selectedTicket?.status === 'APPROVED' && (
          <span className="border border-blue-300 text-blue-600 text-[12px] font-medium px-3 py-1 rounded-full bg-blue-50 shadow-sm">
            ÄÃ£ duyá»‡t
          </span>
        )}
        {selectedTicket?.status === 'DONE' && (
          <span className="border border-green-300 text-green-600 text-[12px] font-medium px-3 py-1 rounded-full bg-green-50 shadow-sm">
            ÄÃ£ tiáº¿p xong
          </span>
        )}
        {selectedTicket?.status === 'REJECTED' && (
          <span className="border border-orange-300 text-orange-600 text-[12px] font-medium px-3 py-1 rounded-full bg-orange-50 shadow-sm">
            Tá»« chá»‘i
          </span>
        )}
        {selectedTicket?.status === 'CANCELED' && (
          <span className="border border-gray-300 text-gray-500 text-[12px] font-medium px-3 py-1 rounded-full bg-gray-50 shadow-sm">
            ÄÃ£ há»§y
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-[#f8f9fa] min-h-screen font-sans">

      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col justify-center">
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-800 m-0">PhÃª duyá»‡t & Quáº£n lÃ½ Lá»‹ch háº¹n Tiáº¿p dÃ¢n</h2>
        </div>
        <p className="text-gray-500 text-[14px] m-0 mt-1">Xem, xÃ©t duyá»‡t, theo dÃµi vÃ  Ä‘Ã¡nh giÃ¡ toÃ n bá»™ yÃªu cáº§u tiáº¿p xÃºc cÃ´ng dÃ¢n vá»›i LÃ£nh Ä‘áº¡o PhÆ°á»ng.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#fef2f2] border-2 border-blue-400 rounded-lg p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="text-[24px] font-bold text-red-600 leading-none mb-1">{pendingCount}</div>
          <div className="text-[13px] font-medium text-red-600">Chá» duyá»‡t</div>
        </div>
        <div className="bg-[#eff6ff] border border-blue-100 rounded-lg p-4 flex flex-col justify-center">
          <div className="text-[24px] font-bold text-blue-700 leading-none mb-1">{approvedCount}</div>
          <div className="text-[13px] font-medium text-blue-700">ÄÃ£ duyá»‡t</div>
        </div>
        <div className="bg-[#f0fdf4] border border-green-100 rounded-lg p-4 flex flex-col justify-center">
          <div className="text-[24px] font-bold text-green-700 leading-none mb-1">{doneCount}</div>
          <div className="text-[13px] font-medium text-green-700">ÄÃ£ tiáº¿p xong</div>
        </div>
        <div className="bg-[#fff7ed] border border-orange-100 rounded-lg p-4 flex flex-col justify-center">
          <div className="text-[24px] font-bold text-orange-600 leading-none mb-1">{rejectedCount}</div>
          <div className="text-[13px] font-medium text-orange-600">Tá»« chá»‘i</div>
        </div>
        <div className="bg-[#f9fafb] border border-gray-100 rounded-lg p-4 flex flex-col justify-center">
          <div className="text-[24px] font-bold text-gray-700 leading-none mb-1">{canceledCount}</div>
          <div className="text-[13px] font-medium text-gray-700">ÄÃ£ há»§y</div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-fit">
        <Tabs
          defaultActiveKey="1"
          className="px-4 pt-2 custom-tabs"
          items={[
            {
              key: '1',
              label: (
                <div className="flex items-center text-[14px] font-bold py-2">
                  <span className="text-blue-600">Chá» duyá»‡t</span>
                  <span className="ml-2 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center font-bold">{pendingCount}</span>
                </div>
              ),
              children: (
                <div className="border-t border-gray-100 -mx-4">
                  <Table
                    columns={columns}
                    dataSource={data.filter(d => d.status === 'PENDING')}
                    rowKey="id"
                    pagination={false}
                    className="custom-table"
                  />
                </div>
              )
            },
            {
              key: '2',
              label: (
                <div className="flex items-center text-[14px] font-bold py-2 text-gray-600">
                  <span>ÄÃ£ duyá»‡t</span>
                  <span className="ml-2 w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] flex items-center justify-center font-bold">{approvedCount}</span>
                </div>
              ),
              children: (
                <div className="border-t border-gray-100 -mx-4">
                  <Table columns={columns} dataSource={data.filter(d => d.status === 'APPROVED')} rowKey="id" pagination={false} className="custom-table" />
                </div>
              )
            },
            {
              key: '3',
              label: (
                <div className="flex items-center text-[14px] font-bold py-2 text-gray-600">
                  <span>ÄÃ£ tiáº¿p xong</span>
                  <span className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white text-[11px] flex items-center justify-center font-bold">{doneCount}</span>
                </div>
              ),
              children: (
                <div className="border-t border-gray-100 -mx-4">
                  <Table columns={columns} dataSource={data.filter(d => d.status === 'DONE')} rowKey="id" pagination={false} className="custom-table" />
                </div>
              )
            },
            {
              key: '4',
              label: (
                <div className="flex items-center text-[14px] font-bold py-2 text-gray-600">
                  <span>Tá»« chá»‘i</span>
                  <span className="ml-2 w-5 h-5 rounded-full bg-orange-400 text-white text-[11px] flex items-center justify-center font-bold">{rejectedCount}</span>
                </div>
              ),
              children: (
                <div className="border-t border-gray-100 -mx-4">
                  <Table columns={columns} dataSource={data.filter(d => d.status === 'REJECTED')} rowKey="id" pagination={false} className="custom-table" />
                </div>
              )
            },
            {
              key: '5',
              label: (
                <div className="flex items-center text-[14px] font-bold py-2 text-gray-600">
                  <span>ÄÃ£ há»§y</span>
                  <span className="ml-2 w-5 h-5 rounded-full bg-gray-400 text-white text-[11px] flex items-center justify-center font-bold">{canceledCount}</span>
                </div>
              ),
              children: (
                <div className="border-t border-gray-100 -mx-4">
                  <Table columns={columns} dataSource={data.filter(d => d.status === 'CANCELED')} rowKey="id" pagination={false} className="custom-table" />
                </div>
              )
            }
          ]}
        />
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

            {/* THÃ”NG TIN CÃ”NG DÃ‚N */}
            <div className="bg-[#f8f9fa] rounded-2xl p-4">
              <h4 className="text-[12px] font-bold text-gray-400 mb-3 uppercase tracking-wide">THÃ”NG TIN CÃ”NG DÃ‚N</h4>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Há» vÃ  tÃªn</div>
                  <div className="font-extrabold text-gray-900 text-[15px]">{selectedTicket.citizenInfo?.name || '---'}</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Äiá»‡n thoáº¡i</div>
                  <div className="font-semibold text-gray-800 text-[15px]">{selectedTicket.citizenInfo?.phone || '---'}</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">CCCD/CMND</div>
                  <div className="font-semibold text-gray-800 text-[15px]">{selectedTicket.citizenInfo?.cccd || '---'}</div>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-gray-400 mb-1">Äá»‹a chá»‰ cÆ° trÃº</div>
                <div className="font-semibold text-gray-800 text-[15px]">{selectedTicket.citizenInfo?.address || '---'}</div>
              </div>
            </div>

            {/* CHI TIáº¾T Lá»ŠCH Háº¸N */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4">
              <h4 className="text-[12px] font-bold text-blue-500 mb-3 uppercase tracking-wide">CHI TIáº¾T Lá»ŠCH Háº¸N</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">LÃ£nh Ä‘áº¡o Ä‘Æ°á»£c háº¹n</div>
                  <div className="font-extrabold text-gray-900 text-[15px] flex items-center">
                    <Award className="w-4 h-4 mr-2 text-blue-500" />
                    {selectedTicket.leader}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">NgÃ y tiáº¿p</div>
                  <div className="font-semibold text-gray-800 text-[15px]">
                    {selectedTicket.date.split('-').reverse().join('/')}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-400 mb-1">Khung giá»</div>
                  <div className="font-semibold text-gray-800 text-[15px]">
                    {selectedTicket.timeSlot}
                  </div>
                </div>
              </div>
            </div>

            {/* LÃ DO */}
            <div className="pt-1">
              <h4 className="text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wide">TOÃ€N VÄ‚N LÃ DO Gáº¶P Máº¶T / KIáº¾N NGHá»Š</h4>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="italic text-gray-700 text-[14px] leading-relaxed m-0">
                  "{selectedTicket.citizenInfo?.content}"
                </p>
              </div>
            </div>

          </div>
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
