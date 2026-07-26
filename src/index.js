import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppV2 from './mock/AppV2';
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById('root')).render(
    <HelmetProvider>
        <AppV2 />
    </HelmetProvider>
);
