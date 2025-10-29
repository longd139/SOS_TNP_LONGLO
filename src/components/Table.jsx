import React from 'react';
import BaseTable from './BaseTable';

// Legacy Table component - now uses BaseTable
// This component is kept for backward compatibility
export default function Table(props) {
  return <BaseTable {...props} />;
}
