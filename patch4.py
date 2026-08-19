import re

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add apiClient import
content = content.replace("import { Navigate } from 'react-router-dom';", "import { Navigate } from 'react-router-dom';\nimport apiClient from '../../utils/apiClient';\nimport { message } from 'antd';")

# 1. State and API integration
api_logic = '''
  const [dbTickets, setDbTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/reception-registrations');
      setDbTickets(res.data || []);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const approveReception = async (receptionId) => {
    try {
      await apiClient.patch(/api/reception-registrations//approve, {
        status: 'APPROVED',
        note: ''
      });
      message.success('Đã phê duyệt đơn thành công!');
      fetchTickets();
    } catch (error) {
      message.error('Lỗi khi phê duyệt đơn');
    }
    
    // Also update local state for immediate UI feedback if needed
    setApprovedReceptionIds((current) => new Set([...current, receptionId]));
  };
'''
content = re.sub(r'  const approveReception = \(receptionId\) => setApprovedReceptionIds\(\(current\) => new Set\(\[\.\.\.current, receptionId\]\)\);', api_logic, content)

# 2. Merge API data with queue logic
# In the original, it mapped over queue. We should map over dbTickets if it has data.
content = content.replace('queue.map((reception)', '(dbTickets.length > 0 ? dbTickets.map(item => ({...item, receptionId: item.id || item.receptionCode, ticketNo: item.receptionCode || item.id, citizenName: item.citizenName || item.citizenInfo?.name})) : queue).map((reception)')

# 3. Update Status checking to look at reception.status if it came from DB
content = content.replace('const isApproved = approvedReceptionIds.has(reception.receptionId);', 'const isApproved = approvedReceptionIds.has(reception.receptionId) || reception.status === "APPROVED" || reception.status === "WAITING_FOR_FEEDBACK";')


with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
