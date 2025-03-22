import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/sensors/${id}`)
      .then(response => setSensor(response.data))
      .catch(error => console.error("Ошибка загрузки датчика:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSensor(prev => ({
      ...prev,
      [name]: name === "signal" ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/sensors/${id}`, sensor)
      .then(() => navigate('/'))
      .catch(error => console.error("Ошибка обновления:", error));
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот датчик?")) {
      axios.delete(`http://localhost:5000/sensors/${id}`)
        .then(() => navigate('/'))
        .catch(error => console.error("Ошибка удаления:", error));
    }
  };

  if (!sensor) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Редактирование датчика</h1>
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
        <button type="submit">💾 Сохранить</button>
        <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'crimson', color: 'white' }}>
          🗑 Удалить
        </button>
      </form>
    </div>
  );
};

export default Detail;
