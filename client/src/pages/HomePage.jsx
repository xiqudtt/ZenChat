import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/HomeStyles.css';

export default function HomePage() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const socketUrl = 'http://localhost:5000';

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/messages/general', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Ошибка загрузки сообщений');
            }

            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/register');
            return;
        }

        fetchMessages();

        const socket = io(socketUrl, {
            auth: {
                token: `Bearer ${token}`
            }
        });

        socket.on('connect', () => {
            console.log('🟢 Connected to server');
            socket.emit('requestHistory');
        });

        socket.on('history', (history) => {
            setMessages(history);
        });

        socket.on('message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        socket.on('error', (err) => {
            setError('Ошибка подключения к серверу');
            console.error('Socket error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [navigate, token]);
    const sendMessage = async () => {
        const sender = localStorage.getItem('username');
        console.log(sender)
        if (!sender) {
            alert('User not authenticated');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({  roomId: 'general', sender ,text: message,})
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setMessage('');
            fetchMessages();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="chat-container">
            <button onClick={handleLogout} className="logout-btn">Logout</button>

            {error && <div className="chat-error">{error}</div>}

            <div className="messages">
                {messages.map((msg, i) => (
                    <div key={i} className="message">
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="send-btn"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
