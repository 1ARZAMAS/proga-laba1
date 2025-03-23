import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
            } catch (error) {
                setError('Ошибка загрузки пользователей. Проверьте соединение с сервером.');
                console.error("Ошибка загрузки пользователей:", error);
            }
        };
        fetchUsers();
    }, []);

    const register = async ({ username, email, password }) => {
        setError(null);

        const usernameExists = users.some(user => user.username === username);
        const emailExists = users.some(user => user.email === email);

        if (usernameExists) return { success: false, message: 'Имя пользователя уже занято' };
        if (emailExists) return { success: false, message: 'Почта уже используется' };

        try {
            const response = await axios.post('http://localhost:5000/users', { username, email, password });
            setUsers(prev => [...prev, response.data]);
            return { success: true };
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError('Ошибка регистрации: некорректные данные.');
                        break;
                    case 500:
                        setError('Ошибка сервера. Попробуйте позже.');
                        break;
                    default:
                        setError('Не удалось зарегистрироваться. Попробуйте позже.');
                }
            } else {
                setError('Ошибка соединения. Проверьте интернет и попробуйте снова.');
            }
            console.error("Ошибка регистрации:", error);
            return { success: false, message: error.message || 'Ошибка регистрации' };
        }
    };

    const login = async (username, password) => {
        setError(null); 

        try {
            const response = await axios.get(`http://localhost:5000/users?username=${username}&password=${password}`);
            if (response.data.length > 0) {
                setIsAuthenticated(true);
                setCurrentUser(response.data[0]);
                return { success: true };
            } else {
                return { success: false, message: 'Неверный логин или пароль' };
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 500:
                        setError('Ошибка сервера при входе. Попробуйте позже.');
                        break;
                    default:
                        setError('Не удалось выполнить вход. Попробуйте позже.');
                }
            } else {
                setError('Ошибка соединения. Проверьте интернет.');
            }
            console.error("Ошибка входа:", error);
            return { success: false, message: error.message || 'Ошибка входа' };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, currentUser, error }}>
            {children}
        </AuthContext.Provider>
    );
};
