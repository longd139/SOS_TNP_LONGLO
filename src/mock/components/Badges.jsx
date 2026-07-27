// ============================================================
// SHARED BADGES — Giống hệt badgeUtils.jsx gốc (inline style)
// ============================================================
import React from 'react';
import { getStatusLabel, getStatusColor, getSlaLabel, getSlaColor, getUrgencyLabel } from '../db';

export function StatusBadge({ status }) {
  const s = getStatusColor(status);
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {getStatusLabel(status)}
    </span>
  );
}

export function SlaBadge({ slaStatus }) {
  const s = getSlaColor(slaStatus);
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {getSlaLabel(slaStatus)}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const isUrgent = urgency === 'URGENT';
  const s = isUrgent ? { bg: '#FEE2E2', color: '#991B1B' } : { bg: '#DBEAFE', color: '#1E40AF' };
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {getUrgencyLabel(urgency)}
    </span>
  );
}
