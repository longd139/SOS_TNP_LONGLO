import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import { store } from './app/store.js';

console.log('Environment:', process.env.REACT_APP_API_URL);
createRoot(document.getElementById('root')).render(
    <HelmetProvider>
        <Provider store={store}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    </HelmetProvider>
);
