// ============================================================
// SHARED BADGES — Dùng chung cho toàn bộ prototype
// ============================================================
import React from 'react';
import { getStatusLabel, getStatusColor, getSlaLabel, getSlaColor, getUrgencyLabel, getUrgencyColor } from '../db';

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

export function SlaBadge({ slaStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSlaColor(slaStatus)}`}>
      {getSlaLabel(slaStatus)}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
      {getUrgencyLabel(urgency)}
    </span>
  );
}

export function SlaStatusIcon({ slaStatus }) {
  const iconMap = {
    'ON_TIME': '🟢', 'NEAR_DUE': '🟡', 'OVERDUE': '🔴',
    'COMPLETED_ON_TIME': '✅', 'COMPLETED_LATE': '⏰',
    'PENDING_EXTENSION': '🟠', 'NOT_APPLICABLE': '⚪',
  };
  return <span className="text-xs">{iconMap[slaStatus] || '⚪'}</span>;
}
