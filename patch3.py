import re

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add apiClient import
content = content.replace("import { Navigate } from 'react-router-dom';", "import { Navigate } from 'react-router-dom';\nimport apiClient from '../../utils/apiClient';\nimport { message } from 'antd';")

# 1. Add states for dynamic data
states = '''
  const [tickets, setTickets] = useState(queue || []);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/reception-registrations');
      // Format the backend data to match the UI expectations
      const formatted = res.data.map(item => ({
        id: item.id || item.receptionCode,
        ticketNo: item.receptionCode || item.ticketNo || item.id,
        status: item.status === 'APPROVED' ? 'WAITING_FOR_FEEDBACK' : 'PROCESSING',
        date: item.receptionDate || item.date,
        slot: item.timeSlot || item.slot,
        citizenName: item.citizenName || item.fullName,
        fullName: item.citizenName || item.fullName,
        topic: item.content || item.topic,
        phone: item.citizenPhone || item.phone
      }));
      setTickets(formatted);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      // Fallback to queue if API fails, just for safety
      setTickets(queue || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);
'''
content = re.sub(r'  const \[activeTicket, setActiveTicket\] = useState\(\(\) => readActiveReceptionFeedback\(\)\);', states + '\n  const [activeTicket, setActiveTicket] = useState(() => readActiveReceptionFeedback());', content)

# 2. Update the queue mapping in render to use tickets
content = content.replace('queue.map((item)', 'tickets.map((item)')

# 3. Modify the handleApprove action
approve_logic = '''
  const handleApprove = async (ticket) => {
    try {
      await apiClient.patch(/api/reception-registrations//approve, {
        status: 'APPROVED',
        note: ''
      });
      message.success('Đã phê duyệt đơn thành công!');
      fetchTickets(); // Refresh list after approval
    } catch (error) {
      message.error('Lỗi khi phê duyệt đơn');
    }
  };
'''

# Find the existing approve function if any, or just insert it.
# Actually in the original mock it was probably handled in the component. Let's look up how it was handled.
