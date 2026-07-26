// ============================================================
// APP V2 — Entry point cho prototype
// Cách chạy: sửa src/index.js, đổi import App from './App' thành import AppV2 from './mock/AppV2'
// ============================================================
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockProvider } from './MockContext';
import AppRoutesV2 from './AppRoutesV2';

export default function AppV2() {
  return (
    <MockProvider>
      <BrowserRouter>
        <AppRoutesV2 />
      </BrowserRouter>
    </MockProvider>
  );
}
