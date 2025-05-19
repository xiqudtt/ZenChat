import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { Auth } from './pages/Auth';
import { Register } from './pages/Register.jsx';
import './index.css';
import HomePage from "./pages/HomePage.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/register" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
