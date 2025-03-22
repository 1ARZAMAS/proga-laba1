import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SensorContext = createContext(); // создаем контекст для общего доступа

export const SensorProvider = ({ children }) => { // в нем находится state
    const [sensors, setSensors] = useState([]); // обновляем список
    const [selectedSensor, setSelectedSensor] = useState(null);

    const fetchSensors = () => {
    axios.get('http://localhost:5000/sensors')
        .then(response => setSensors(response.data))
        .catch(error => console.error("Ошибка загрузки датчиков:", error));
    };

    useEffect(() => {
        fetchSensors();

    window.addEventListener('focus', fetchSensors);

    return () => {
        window.removeEventListener('focus', fetchSensors);
    };
    }, []);

    const addSensor = (newSensor) => {
        setSensors(prev => [...prev, newSensor]);
    };

    const updateSensor = (updatedSensor) => {
    setSensors(prev =>
        prev.map(sensor => (sensor.id === updatedSensor.id ? updatedSensor : sensor))
        );
    };

    const deleteSensor = (id) => {
        setSensors(prev => prev.filter(sensor => sensor.id !== id));
    };

    return (
        <SensorContext.Provider value={{
        sensors,
        selectedSensor,
        setSelectedSensor,
        addSensor,
        updateSensor,
        deleteSensor
        }}>
        {children}
        </SensorContext.Provider>
    );
};
