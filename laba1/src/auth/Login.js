import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Auth.css';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError('Заполните все поля');
            return;
        }

        const result = await login(form.username, form.password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Вход</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Имя пользователя:</label>
                <input name="username" value={form.username} onChange={handleChange} required />
                <label>Пароль:</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
                <button type="submit">Войти</button>
            </form>
            <div className="back-link">
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </div>
        </div>
    );
};

export default Login;
