import re

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to move the dbTickets state and useEffect to the top, before the if statement.
# Find the exact chunk that needs moving.
chunk_to_move = '''  const [dbTickets, setDbTickets] = useState([]);
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
  }, []);'''

content = content.replace(chunk_to_move, '')

# We also have pproveReception right after it which doesn't contain hooks but it's fine where it is.
# Now insert the chunk before the if statement.
if_statement = '  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;'

content = content.replace(if_statement, chunk_to_move + '\n\n' + if_statement)

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
