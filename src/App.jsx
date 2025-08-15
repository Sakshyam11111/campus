// App.jsx (Updated to use Router)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TexasCampusPlatform from './components/TexasCampusPlatform';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<TexasCampusPlatform />} />
      </Routes>
    </Router>
  );
};

export default App;