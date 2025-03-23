import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SensorContext } from '../SensorContext';

const Form = () => {
    const navigate = useNavigate();
    const { addSensor } = useContext(SensorContext);

    const [formData, setFormData] = useState({
        name: '',
        status: '',
        type: '',
        location: '',
        signal: 0,
        lastChecked: '',
        isOnline: true
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : name === 'signal'
                    ? Number(value)
                    : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("http://localhost:5000/sensors", JSON.stringify(formData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            addSensor(response.data);
            navigate('/');
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError('Некорректные данные. Проверьте введенные значения.');
                        break;
                    case 500:
                        setError('Ошибка сервера. Попробуйте позже.');
                        break;
                    default:
                        setError('Не удалось добавить датчик. Попробуйте позже.');
                }
            } else {
                setError('Ошибка соединения. Проверьте подключение к серверу.');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Добавить датчик</h1>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Название:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <br /><br />
                <label>
                    Статус:
                    <input type="text" name="status" value={formData.status} onChange={handleChange} required />
                </label>
                <br /><br />
                <label>
                    Тип:
                    <input type="text" name="type" value={formData.type} onChange={handleChange} required />
                </label>
                <br /><br />
                <label>
                    Локация:
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </label>
                <br /><br />
                <label>
                    Сигнал (%):
                    <input type="number" name="signal" value={formData.signal} onChange={handleChange} required />
                </label>
                <br /><br />
                <label>
                    Последняя проверка:
                    <input type="date" name="lastChecked" value={formData.lastChecked} onChange={handleChange} required />
                </label>
                <br /><br />
                <label>
                    Онлайн:
                    <input type="checkbox" name="isOnline" checked={formData.isOnline} onChange={handleChange} />
                </label>
                <br /><br />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default Form;
