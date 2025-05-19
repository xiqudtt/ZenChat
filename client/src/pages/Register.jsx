import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthStyles.css';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();


        if (!username || !password || !confirmPassword) {
            return handleError('Пожалуйста, заполните все поля');
        }

        if (password !== confirmPassword) {
            return handleError('Пароли не совпадают');
        }

        if (password.length < 6) {
            return handleError('Пароль должен содержать минимум 6 символов');
        }

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate('/home');
            } else {
                handleError(data.message || 'Ошибка регистрации');
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
                    <h2>Create Account</h2>
                    <p>Join us today!</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
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

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
};
