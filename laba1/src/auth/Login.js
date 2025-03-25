import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Auth.css';
import { ClipLoader } from "react-spinners";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!form.username || !form.password) {
            setError('Заполните все поля');
            return;
        }

        try {
            const result = await login(form.username, form.password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError('Ошибка входа: некорректные данные.');
                        break;
                    case 500:
                        setError('Ошибка сервера. Попробуйте позже.');
                        break;
                    default:
                        setError('Ошибка входа. Попробуйте позже.');
                }
            } else {
                setError('Ошибка соединения с сервером. Проверьте интернет-соединение.');
            }
        }
    };
    
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ClipLoader color="#007bff" size={50} />
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h2>Вход</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Имя пользователя:</label>
                <input 
                    name="username" 
                    value={form.username} 
                    onChange={handleChange} 
                    required 
                />
                <label>Пароль:</label>
                <input 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Войти</button>
            </form>
            <div className="back-link">
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </div>
        </div>
    );
};

export default Login;
