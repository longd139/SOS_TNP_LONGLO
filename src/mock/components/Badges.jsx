import React from 'react';
import { getStatusLabel, getStatusColor, getSlaLabel, getSlaColor, getUrgencyLabel } from '../db';

export function StatusBadge({ status }) {
  const s = getStatusColor(status);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs"
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.color + '40' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {getStatusLabel(status)}
    </span>
  );
}

export function SlaBadge({ slaStatus }) {
  const s = getSlaColor(slaStatus);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border shadow-2xs"
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.color + '40' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {getSlaLabel(slaStatus)}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const isUrgent = urgency === 'URGENT' || urgency === 'HIGH';
  const s = isUrgent 
    ? { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' } 
    : { bg: '#F1F5F9', color: '#334155', border: '#CBD5E1' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border shadow-2xs"
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}>
      <span className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
      {isUrgent ? 'Khẩn cấp (24h)' : 'Thông thường (3-5d)'}
    </span>
  );
}
