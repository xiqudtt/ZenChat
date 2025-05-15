import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthStyles.css';

export const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            return handleError('Пожалуйста, заполните все поля');
        }

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate('/');
            } else {
                handleError(data.message || 'Ошибка входа');
            }
        } catch (err) {
            setIsLoading(false);
            handleError('Ошибка соединения с сервером');
        }
    };

    const handleError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Please enter your credentials</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <Link to="/register" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};
