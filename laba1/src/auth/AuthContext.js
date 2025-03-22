import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error("Ошибка загрузки пользователей:", error));
    }, []);

    const register = async ({ username, email, password }) => {
        const usernameExists = users.some(user => user.username === username);
        const emailExists = users.some(user => user.email === email);

        if (usernameExists) return { success: false, message: 'Имя пользователя уже занято' };
        if (emailExists) return { success: false, message: 'Почта уже используется' };

        try {
            const response = await axios.post('http://localhost:5000/users', { username, email, password });
            setUsers(prev => [...prev, response.data]);
            return { success: true };
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            return { success: false, message: 'Ошибка регистрации' };
        }
    };

    const login = async (username, password) => {
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
            console.error("Ошибка входа:", error);
            return { success: false, message: 'Ошибка входа' };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
