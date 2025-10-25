import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom"; 

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter> 
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);
