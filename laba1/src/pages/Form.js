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

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("http://localhost:5000/sensors", JSON.stringify(formData), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                addSensor(response.data); // добавляем в state
                navigate('/');
            })
            .catch(error => console.error("Ошибка добавления:", error));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Добавить датчик</h1>
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
