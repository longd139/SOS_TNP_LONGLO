import React from 'react';
import { X } from 'lucide-react';

export function DetailField({ label, value, wide = false, muted = false }) {
  return (
    <div className={`${wide ? 'col-span-full' : ''} rounded-md bg-gray-50 p-3`}>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className={`mt-1 whitespace-pre-wrap break-words text-sm ${muted ? 'text-gray-500' : 'font-semibold text-gray-900'}`}>
        {value === undefined || value === null || value === '' ? 'Chưa có dữ liệu' : value}
      </dd>
    </div>
  );
}

export function DetailSection({ title, children, tone = 'plain' }) {
  const toneClass = tone === 'accent' ? 'border-blue-100 bg-blue-50/50' : tone === 'warning' ? 'border-amber-100 bg-amber-50/60' : 'border-gray-200 bg-white';
  return (
    <section className={`rounded-xl border p-4 sm:p-5 ${toneClass}`}>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}

export function DetailGrid({ children, cols = 2 }) {
  const colClass = cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  return <dl className={`grid gap-3 ${colClass}`}>{children}</dl>;
}

export function TicketDetailContent({ title, badges, meta = [], descriptionLabel = 'Mô tả chi tiết', description, location, sections, attachments, footerSection }) {
  return (
    <>
      <div>
        <p className="mb-2 text-lg font-medium break-words text-gray-900">{title || 'Chưa có dữ liệu tiêu đề'}</p>
        {badges?.length > 0 && <div className="flex flex-wrap items-center gap-2">{badges.map((badge) => <span key={badge.label} className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${badge.className || 'bg-indigo-100 text-indigo-800'}`}>{badge.label}</span>)}</div>}
      </div>
      {meta.length > 0 && <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">{meta.map((item) => <div key={item.label} className="min-w-0 text-sm text-gray-600"><span className="font-medium text-gray-500">{item.label}:</span> <span className="break-words">{item.value || 'Chưa có dữ liệu'}</span></div>)}</div>}
      <DetailSection title={descriptionLabel}><div className="rounded-md bg-gray-50 p-3"><p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{description || 'Chưa có dữ liệu mô tả.'}</p></div></DetailSection>
      {location && <DetailSection title={location.title || 'Vị trí'}><div className="rounded-md bg-gray-50 p-3"><p className="whitespace-pre-wrap break-words text-sm text-gray-700">{location.value || 'Chưa có thông tin vị trí.'}</p>{location.extra && <div className="mt-2 text-xs text-gray-500">{location.extra}</div>}</div></DetailSection>}
      {sections}
      {attachments && <DetailSection title="Hình ảnh / video"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{attachments.length > 0 ? attachments : <p className="col-span-full rounded-md bg-gray-50 p-3 text-sm text-gray-500">Chưa có hình ảnh hoặc video đính kèm.</p>}</div></DetailSection>}
      {footerSection}
    </>
  );
}

export function TicketDetailModal({ open = true, title = 'Chi tiết phiếu', code, subtitle, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`${title} ${code || ''}`}>
      <button type="button" className="absolute inset-0 cursor-default bg-gray-900/40" aria-label="Đóng chi tiết" onClick={onClose} />
      <section className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-blue-600">{title}</p>
            {code && <h2 className="mt-1 truncate text-lg font-semibold text-gray-900">{code}</h2>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button type="button" className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </header>
        <div className="min-h-0 space-y-4 overflow-y-auto p-6">{children}</div>
        {footer && <footer className="border-t border-gray-200 bg-white px-6 py-3">{footer}</footer>}
      </section>
    </div>
  );
}
