import re

with open('src/pages-v2/admin/ApproveSchedule.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add apiClient import
content = content.replace("import { ClipboardCheck", "import apiClient from '../../utils/apiClient';\nimport { ClipboardCheck")

# 2. Remove MOCK_DATA
content = re.sub(r'const MOCK_DATA = \[.*?\];', '', content, flags=re.DOTALL)

# 3. Replace useEffect and localStorage with fetch
fetch_logic = '''
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/reception-registrations');
      setData(res.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh sách lịch tiếp dân');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
'''
content = re.sub(r'  useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);', fetch_logic, content)

# 4. Replace executeAction
execute_action = '''
  const executeAction = async (id, newStatus, note = '', result = null) => {
    try {
      await apiClient.patch(/api/reception-registrations//approve, {
        status: newStatus,
        note: note,
        result: result
      });

      let msg = 'Đã cập nhật trạng thái';
      if (newStatus === 'APPROVED') msg = 'Đã duyệt lịch hẹn thành công';
      if (newStatus === 'REJECTED') msg = 'Đã từ chối lịch hẹn';
      if (newStatus === 'CANCELED') msg = 'Đã hủy lịch hẹn';
      if (newStatus === 'DONE') msg = 'Đã đánh dấu tiếp xong';
      message.success(msg);
      
      fetchData(); // Reload from backend
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }

    setIsModalOpen(false);
    setActionModal({ isOpen: false, action: null, ticketId: null });
  };
'''
content = re.sub(r'  const executeAction = \(id, newStatus, note = \'\', result = null\) => \{[\s\S]*?setActionModal\(\{ isOpen: false, action: null, ticketId: null \}\);\n  \};', execute_action, content)

# 5. Add loading to Table
content = content.replace('pagination={false}', 'pagination={false} loading={loading}')

with open('src/pages-v2/admin/ApproveSchedule.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
