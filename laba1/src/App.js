import React  from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Form from "./pages/Form";
import { SensorProvider } from './SensorContext';

const App = () => {
  return (
    <SensorProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/add" element={<Form />} />
        </Routes>
      </Router>
    </SensorProvider>
  );
};

export default App;