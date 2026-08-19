import re

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('reception.date', '(reception.date || reception.receptionDate)')
content = content.replace('reception.slot', '(reception.slot || reception.timeSlot)')
content = content.replace('reception.topic', '(reception.topic || reception.content || reception.citizenInfo?.content)')

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
