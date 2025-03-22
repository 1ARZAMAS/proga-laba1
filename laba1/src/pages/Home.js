import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/sensors")
      .then(response => setSensors(response.data))
      .catch(error => console.error("Ошибка загрузки датчиков:", error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Список датчиков</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {sensors.map(sensor => (
          <div key={sensor.id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            width: '220px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <h3>{sensor.name}</h3>
            <p><strong>Статус:</strong> {sensor.status}</p>
            <p><strong>Тип:</strong> {sensor.type}</p>
            <p><strong>Локация:</strong> {sensor.location}</p>
            <Link to={`/detail/${sensor.id}`}>Подробнее</Link>
          </div>
        ))}
      </div>
      <br />
      <Link to="/add">➕ Добавить датчик</Link>
    </div>
  );
};

export default Home;
