import React  from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Form from "./pages/Form";
import { SensorProvider } from './SensorContext';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import Login from './auth/Login';
import Register from './auth/Register';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <SensorProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/detail/:id" element={<PrivateRoute><Detail /></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><Form /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SensorProvider>
  );
};

export default App;