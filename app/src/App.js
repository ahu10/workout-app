import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard.js';
import Preferences from './components/Preferences.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';

function App() {
  const [token, setToken] = useState(""); // Initialize token state

  // Check if a token exists in localStorage on component mount
  useEffect(() => {
    setTimeout(() => {
      const storedToken = localStorage.getItem("token");
      //console.log("Token from storage", storedToken);
      if (storedToken) {
        setToken(storedToken);
      }
    }, 100000); // Adjust the delay as needed
  }, []);

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setToken={setToken} />} />

          <Route
            path="/"
            element={token ? <Dashboard token={token} setToken={setToken} /> : <Login setToken={setToken} />}
          />

          <Route path="/dashboard" element={<Dashboard token={token} />} />
          <Route path="/preferences" element={<Preferences token={token} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

