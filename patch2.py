import re

with open('src/pages-v2/admin/ApproveSchedule.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = content.replace("import { ClipboardCheck", "import { useMock } from '../../mock/MockContext';\nimport { ClipboardCheck")

# Add hook usage
content = content.replace("  const [loading, setLoading] = useState(false);", "  const { currentUser } = useMock();\n  const role = currentUser?.role || 'CITIZEN';\n  const isLeaderOrAdmin = ['APPROVER', 'LEADER', 'ADMIN'].includes(role);\n  const [loading, setLoading] = useState(false);")

# Update action buttons visibility
content = content.replace("if (record.status === 'PENDING') {", "if (record.status === 'PENDING' && isLeaderOrAdmin) {")
content = content.replace("} else if (record.status === 'APPROVED') {", "} else if (record.status === 'APPROVED' && isLeaderOrAdmin) {")

with open('src/pages-v2/admin/ApproveSchedule.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
