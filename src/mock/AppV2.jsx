// ============================================================
// APP V2 — Entry point cho prototype
// Cách chạy: sửa src/index.js, đổi import App from './App' thành import AppV2 from './mock/AppV2'
// ============================================================
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { MockProvider } from './MockContext';
import AppRoutesV2 from './AppRoutesV2';
import { AuthProvider } from '../contexts/AuthContext';

export default function AppV2() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MockProvider>
          <BrowserRouter>
            <AppRoutesV2 />
          </BrowserRouter>
        </MockProvider>
      </AuthProvider>
    </Provider>
  );
}
