import re

with open('src/mock/db.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_user = '  { id: "USR-033", fullName: "Nguyễn Quản Trị",    phone: "0900000000", role: "ADMIN",                departmentId: "DEP-LEADERSHIP", status: "ACTIVE", avatarUrl: "/mock/avatars/32.png" },\n];'
content = content.replace('  { id: "USR-032", fullName: "Võ Minh Tuấn",       phone: "0987654342", role: "ADMIN",                departmentId: "DEP-LEADERSHIP", status: "ACTIVE", avatarUrl: "/mock/avatars/32.png" },\n];', 
'  { id: "USR-032", fullName: "Võ Minh Tuấn",       phone: "0987654342", role: "ADMIN",                departmentId: "DEP-LEADERSHIP", status: "ACTIVE", avatarUrl: "/mock/avatars/32.png" },\n' + new_user)

with open('src/mock/db.js', 'w', encoding='utf-8') as f:
    f.write(content)
