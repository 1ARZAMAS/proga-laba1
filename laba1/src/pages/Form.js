import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    type: '',
    location: '',
    signal: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "signal" ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/sensors", formData)
      .then(() => navigate('/'))
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
        <button type="submit">➕ Добавить</button>
      </form>
    </div>
  );
};

export default Form;
