import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SensorContext } from '../SensorContext';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        sensors,
        updateSensor: updateSensorInContext,
        deleteSensor: deleteSensorFromContext
    } = useContext(SensorContext);

    const [sensor, setSensor] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const foundSensor = sensors.find(s => String(s.id) === id);
        if (foundSensor) {
            setSensor(foundSensor);
        } else {
            setError('Датчик не найден');
        }
    }, [id, sensors]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSensor(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'signal' ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios.put(`http://localhost:5000/sensors/${id}`, JSON.stringify(sensor), {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                updateSensorInContext(response.data);
                navigate('/');
            })
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError('Некорректные данные. Проверьте введенные значения.');
                        break;
                    case 500:
                        setError('Внутренняя ошибка сервера. Попробуйте позже.');
                        break;
                    default:
                        setError('Ошибка обновления. Попробуйте позже.');
                }
            } else {
                setError('Ошибка соединения с сервером.');
            }
        }
    };

    const handleDelete = () => {
        if (window.confirm("Вы уверены, что хотите удалить этот датчик?")) {
            try {
                axios.delete(`http://localhost:5000/sensors/${id}`)
                .then(() => {
                    deleteSensorFromContext(id);
                    navigate('/');
                })
                .catch(error => console.error("Ошибка удаления:", error));
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 400:
                            setError('Невозможно удалить датчик. Некорректный запрос.');
                            break;
                        case 500:
                            setError('Ошибка сервера. Повторите попытку позже.');
                            break;
                        default:
                            setError('Ошибка удаления. Попробуйте позже.');
                    }
                } else {
                    setError('Ошибка соединения с сервером.');
                }
            }
        }
    };

    if (error) {
        return (
            <div>
                <h1>{error}</h1>
                <p>Перейдите на <a href="/">главную страницу</a>.</p>
            </div>
        );
    }

    if (!sensor) return <div>Загрузка...</div>;

    return (
        <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
            <div style={{ flex: 1 }}>
                <h1>Редактирование датчика</h1>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>
                        Название:
                        <input type="text" name="name" value={sensor.name} onChange={handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Статус:
                        <input type="text" name="status" value={sensor.status} onChange={handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Тип:
                        <input type="text" name="type" value={sensor.type} onChange={handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Локация:
                        <input type="text" name="location" value={sensor.location} onChange={handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Сигнал (%):
                        <input type="number" name="signal" value={sensor.signal} onChange={handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Последняя проверка:
                        <input type="date" name="lastChecked" value={sensor.lastChecked || ''} onChange={handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Онлайн:
                        <input type="checkbox" name="isOnline" checked={sensor.isOnline || false} onChange={handleChange} />
                    </label>
                    <br /><br />
                    <button type="submit">💾 Сохранить</button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        style={{ marginLeft: '10px', backgroundColor: 'crimson', color: 'white' }}
                    >
                        Удалить
                    </button>
                </form>
            </div>

            <div style={{ flex: 1 }}>
                <h2>Текущие данные датчика</h2>
                <table border="1" cellPadding="8" cellSpacing="0">
                    <tbody>
                        {Object.entries(sensor).map(([key, value]) => (
                            <tr key={key}>
                                <td><strong>{key}</strong></td>
                                <td>
                                    {key === 'isOnline' ? (value ? 'Онлайн' : 'Оффлайн') : String(value)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Detail;
