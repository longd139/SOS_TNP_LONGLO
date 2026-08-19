import re

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify the <thead> to add "Đánh giá" column before "Thao tác"
content = content.replace(
    '<th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Thao tác</th>',
    '<th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Đánh giá</th><th className="px-5 py-3">Thao tác</th>'
)

# Replace the <td> containing the Trạng thái and Thao tác buttons
td_search = r'<td className="px-5 py-4">\{isRated \? <Status tone="green" icon=\{<CheckCircle2 size=\{13\} />\}>Hoàn thành</Status> : isActive \? <Status tone="blue" icon=\{<MonitorUp size=\{13\} />\}>Đang hiển thị đánh giá</Status> : isApproved \? <Status tone="blue" icon=\{<CheckCircle2 size=\{13\} />\}>\{labels\.approved\}</Status> : <span className="text-xs text-amber-600">Chờ phê duyệt đơn</span>\}</td>\s*<td className="px-5 py-4"><div className="flex flex-wrap gap-2"><button type="button" className=\{ounded-lg border px-3 py-2 text-xs font-semibold \$\{isApproved \|\| isRated \? \'border-emerald-200 bg-emerald-50 text-emerald-700\' : \'border-gray-300 bg-white text-gray-700 hover:bg-gray-50\'\}\} onClick=\{\(\) => approveReception\(reception\.receptionId\)\} disabled=\{isApproved \|\| isRated\}>\{isApproved \|\| isRated \? labels\.approved : labels\.approve\}</button><button type="button" disabled=\{\!isApproved \|\| isRated\} className=\{ounded-lg px-3 py-2 text-xs font-semibold text-white \$\{\!isApproved \|\| isRated \? \'cursor-not-allowed bg-gray-300\' : isActive \? \'bg-emerald-600 hover:bg-emerald-700\' : \'bg-blue-600 hover:bg-blue-700\'\}\} onClick=\{\(\) => invite\(reception\)\}>\{isRated \? \'Hoàn thành\' : isActive \? \'Hiển thị lại đánh giá\' : labels\.invite\}</button></div></td>'

td_replacement = '''<td className="px-5 py-4">{isRated ? <Status tone="green" icon={<CheckCircle2 size={13} />}>Hoàn thành</Status> : isApproved ? <Status tone="blue" icon={<CheckCircle2 size={13} />}>{labels.approved}</Status> : <span className="text-xs text-amber-600">Chờ phê duyệt đơn</span>}</td>
<td className="px-5 py-4 text-sm font-medium">
  {(reception.status === 'DONE' || reception.status === 'COMPLETED' || isRated) ? (
    isRated ? <span className="text-emerald-600">Đã đánh giá</span> : <span className="text-amber-600">Chưa đánh giá</span>
  ) : null}
</td>
<td className="px-5 py-4"><button type="button" className={ounded-lg border px-3 py-2 text-xs font-semibold } onClick={() => approveReception(reception.receptionId)} disabled={isApproved || isRated}>{isApproved || isRated ? labels.approved : labels.approve}</button></td>'''

content = re.sub(td_search, td_replacement, content, flags=re.DOTALL)

with open('src/pages-v2/admin/ReceptionFeedbackDispatchPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
