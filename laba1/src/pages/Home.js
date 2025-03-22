import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SensorContext } from '../SensorContext'; // путь может отличаться

const Home = () => {
    const { sensors } = useContext(SensorContext);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Список датчиков</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {sensors.map(sensor => (
                    <div key={sensor.id} style={{
                        border: '1px solid #ccc',
                        padding: '15px',
                        width: '250px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                        <h3>{sensor.name}</h3>
                        <p><strong>Статус:</strong> {sensor.status}</p>
                        <p><strong>Тип:</strong> {sensor.type}</p>
                        <p><strong>Локация:</strong> {sensor.location}</p>
                        <p><strong>Сигнал:</strong> {sensor.signal}%</p>
                        <p><strong>Проверка:</strong> {sensor.lastChecked}</p>
                        <p>
                            <strong>Состояние:</strong>{' '}
                            {sensor.isOnline ? 'Онлайн' : 'Оффлайн'}
                        </p>
                        <Link to={`/detail/${sensor.id}`}>🔍 Подробнее</Link>
                    </div>
                ))}
            </div>
            <br />
            <Link to="/add">➕ Добавить датчик</Link>
        </div>
    );
};

export default Home;
